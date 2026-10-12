import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { localISODate } from '../lib/date'

// Self-service admin for clubs on the "Клуб" plan (clubs.self_service). RLS
// only allows these writes for staff of such clubs; on "Клуб Pro" the Hub
// does them instead.

export interface Group {
  id: string
  name: string
  room: string | null
}

export function useGroups(clubId: string | undefined) {
  return useQuery({
    queryKey: ['groups', clubId],
    queryFn: async (): Promise<Group[]> => {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, room')
        .eq('club_id', clubId as string)
        .order('name')
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}

export interface NewStudent {
  full_name: string
  birth_year: number | null
  group_id: string | null
  belt_id: string | null
  monthly_fee_cents: number | null
  phone: string | null
  email: string | null
  guardian_first_name: string | null
  guardian_phone: string | null
}

export function useAddStudent(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (student: NewStudent) => {
      const { error } = await supabase.from('members').insert({
        ...student,
        club_id: clubId,
        role: 'student',
        status: 'active',
        joined_at: localISODate(),
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] }),
  })
}

export function useUpdateStudent(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      memberId,
      updates,
    }: {
      memberId: string
      updates: Partial<{ belt_id: string | null; group_id: string | null; monthly_fee_cents: number | null; status: string }>
    }) => {
      const { error } = await supabase.from('members').update(updates).eq('id', memberId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] }),
  })
}

export interface ClassInput {
  title: string
  weekday: number
  start_time: string
  duration_min: number
  group_id: string | null
  room: string | null
}

export function useSaveClass(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: ClassInput }) => {
      const { error } = id
        ? await supabase.from('classes').update(input).eq('id', id)
        : await supabase.from('classes').insert({ ...input, club_id: clubId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule', clubId] }),
  })
}

export function useDeleteClass(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('classes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule', clubId] }),
  })
}
