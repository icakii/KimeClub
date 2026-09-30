import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface Payment {
  id: string
  amount_cents: number
  currency: string
  method: string
  period_start: string
  period_end: string
  status: 'paid' | 'due' | 'overdue' | 'waived'
  created_at: string
}

export function usePayments(memberId: string | undefined) {
  return useQuery({
    queryKey: ['payments', memberId],
    queryFn: async (): Promise<Payment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select('id, amount_cents, currency, method, period_start, period_end, status, created_at')
        .eq('member_id', memberId as string)
        .order('period_start', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!memberId,
  })
}
