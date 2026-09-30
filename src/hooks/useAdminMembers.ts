import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface AdminMember {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  role: 'owner' | 'coach' | 'student'
  status: 'active' | 'trial' | 'paused' | 'left'
  birth_year: number | null
  user_id: string | null
  belt: { id: string; rank: number; name_bg: string; name_en: string; color_hex: string } | null
}

export function useAdminMembers(clubId: string | undefined) {
  return useQuery({
    queryKey: ['admin-members', clubId],
    queryFn: async (): Promise<AdminMember[]> => {
      const { data, error } = await supabase
        .from('members')
        .select(
          'id, full_name, email, phone, role, status, birth_year, user_id, belt:belts(id, rank, name_bg, name_en, color_hex)',
        )
        .eq('club_id', clubId as string)
        .order('full_name')
      if (error) throw error
      return data as unknown as AdminMember[]
    },
    enabled: !!clubId,
  })
}

export function useUpdateMember(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      memberId,
      updates,
    }: {
      memberId: string
      updates: Partial<Pick<AdminMember, 'belt' | 'status'>> & { belt_id?: string | null }
    }) => {
      const { belt: _belt, ...rest } = updates
      const { error } = await supabase.from('members').update(rest).eq('id', memberId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] })
    },
  })
}

interface CreateMemberAccountInput {
  club_id: string
  member_id?: string
  full_name?: string
  email: string
  password: string
  belt_id?: string
  role?: 'student' | 'coach'
  birth_year?: number
  phone?: string
  guardian_consent?: boolean
}

export function useCreateMemberAccount(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateMemberAccountInput) => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      const { data, error } = await supabase.functions.invoke('create-member-account', {
        body: input,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      return data.member as AdminMember
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members', clubId] })
    },
  })
}
