import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export interface MemberBelt {
  id: string
  rank: number
  name_bg: string
  name_en: string
  color_hex: string
  color2_hex: string | null
  grade_bg: string | null
  grade_en: string | null
}

export interface Member {
  id: string
  full_name: string
  role: 'owner' | 'coach' | 'student'
  status: 'active' | 'trial' | 'paused' | 'left'
  group_id: string | null
  photo_path: string | null
  belt: MemberBelt | null
}

export function useMember(clubId: string | undefined) {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['member', clubId, userId],
    queryFn: async (): Promise<Member> => {
      const { data, error } = await supabase
        .from('members')
        .select(
          'id, full_name, role, status, group_id, photo_path, belt:belts(id, rank, name_bg, name_en, color_hex, color2_hex, grade_bg, grade_en)',
        )
        .eq('club_id', clubId as string)
        .eq('user_id', userId as string)
        .single()
      if (error) throw error
      return data as unknown as Member
    },
    enabled: !!clubId && !!userId,
  })
}
