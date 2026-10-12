import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { localISODate } from '../lib/date'

export interface PaidThrough {
  member_id: string
  period_end: string
}

// Every 'paid' payment row for the club, used to compute each member's
// "paid through" date client-side (max period_end per member_id) — small
// dataset, no need for a dedicated view/RPC.
export function usePaidThrough(clubId: string | undefined) {
  return useQuery({
    queryKey: ['paid-through', clubId],
    queryFn: async (): Promise<Map<string, string>> => {
      const { data, error } = await supabase
        .from('payments')
        .select('member_id, period_end')
        .eq('club_id', clubId as string)
        .eq('status', 'paid')
      if (error) throw error

      const map = new Map<string, string>()
      for (const row of data as PaidThrough[]) {
        const current = map.get(row.member_id)
        if (!current || row.period_end > current) map.set(row.member_id, row.period_end)
      }
      return map
    },
    enabled: !!clubId,
  })
}

export function useRecordPayment(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      memberId,
      amountCents,
      method,
      paidThrough,
    }: {
      memberId: string
      amountCents: number
      method: 'cash' | 'card' | 'bank' | 'online'
      paidThrough: string | undefined
    }) => {
      const base = paidThrough ? new Date(`${paidThrough}T00:00:00`) : new Date()
      const periodStart = new Date(Math.max(base.getTime(), Date.now()))
      if (paidThrough) periodStart.setDate(periodStart.getDate() + 1)
      const periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + 1)
      periodEnd.setDate(periodEnd.getDate() - 1)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from('payments').insert({
        club_id: clubId,
        member_id: memberId,
        amount_cents: amountCents,
        currency: 'EUR',
        method,
        period_start: localISODate(periodStart),
        period_end: localISODate(periodEnd),
        status: 'paid',
        recorded_by: user?.id ?? null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paid-through', clubId] })
    },
  })
}

// Coaches fix their own mistakes: removes the most recent paid month for a
// member (e.g. recorded for the wrong student). RLS limits this to staff
// of the same club.
export function useUndoLastPayment(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data, error } = await supabase
        .from('payments')
        .select('id')
        .eq('club_id', clubId as string)
        .eq('member_id', memberId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!data) return
      const { error: deleteError } = await supabase.from('payments').delete().eq('id', data.id)
      if (deleteError) throw deleteError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paid-through', clubId] })
    },
  })
}

export type ReminderResult = { sent: true; to: string } | { error: string }

// Emails a student 3+ months behind (or their parent). The function checks
// staff rights, that they really are behind, and throttles to one per 14 days.
export function useSendDuesReminder(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (memberId: string): Promise<ReminderResult> => {
      const { data, error } = await supabase.functions.invoke('send-dues-reminder', { body: { member_id: memberId } })
      if (error) {
        // Non-2xx: the body carries the reason code.
        const body = await (error as { context?: Response }).context?.json?.().catch(() => null)
        return { error: body?.error ?? 'send_failed' }
      }
      return data as ReminderResult
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] }),
  })
}
