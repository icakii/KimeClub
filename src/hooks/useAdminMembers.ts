import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { MemberBelt } from './useMember'

export interface AdminMember {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  role: 'owner' | 'coach' | 'student'
  status: 'active' | 'trial' | 'paused' | 'left'
  group_id: string | null
  monthly_fee_cents: number | null
  birth_year: number | null
  height_cm: number | null
  weight_kg: number | null
  guardian_first_name: string | null
  guardian_last_name: string | null
  guardian_phone: string | null
  guardian_email: string | null
  photo_path: string | null
  last_reminder_at: string | null
  joined_at: string | null
  belt: MemberBelt | null
}

// Club staff see their own club's members, read-only: every detail is
// entered by us from the Hub. Staff only record fees and attendance.
export function useAdminMembers(clubId: string | undefined) {
  return useQuery({
    queryKey: ['admin-members', clubId],
    queryFn: async (): Promise<AdminMember[]> => {
      const { data, error } = await supabase
        .from('members')
        .select(
          'id, full_name, email, phone, role, status, group_id, monthly_fee_cents, birth_year, height_cm, weight_kg, guardian_first_name, guardian_last_name, guardian_phone, guardian_email, photo_path, last_reminder_at, joined_at, belt:belts(id, rank, name_bg, name_en, color_hex, color2_hex, grade_bg, grade_en)',
        )
        .eq('club_id', clubId as string)
        .order('full_name')
      if (error) throw error
      return data as unknown as AdminMember[]
    },
    enabled: !!clubId,
  })
}

// Photos live in a private bucket; read them through a short-lived URL.
export function usePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ['photo-url', path],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('member-photos').createSignedUrl(path as string, 3600)
      if (error) throw error
      return data.signedUrl
    },
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
  })
}
