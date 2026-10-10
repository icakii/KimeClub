import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

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
  guardian_first_name: string | null
  guardian_last_name: string | null
  guardian_phone: string | null
  guardian_email: string | null
  belt: { id: string; rank: number; name_bg: string; name_en: string; color_hex: string } | null
}

// Read-only: club staff can see their own club's members (including
// guardian contact info) but cannot add or edit anyone here. Adding a
// member or creating their login happens from TatamiHub, not this site.
export function useAdminMembers(clubId: string | undefined) {
  return useQuery({
    queryKey: ['admin-members', clubId],
    queryFn: async (): Promise<AdminMember[]> => {
      const { data, error } = await supabase
        .from('members')
        .select(
          'id, full_name, email, phone, role, status, group_id, monthly_fee_cents, birth_year, guardian_first_name, guardian_last_name, guardian_phone, guardian_email, belt:belts(id, rank, name_bg, name_en, color_hex)',
        )
        .eq('club_id', clubId as string)
        .order('full_name')
      if (error) throw error
      return data as unknown as AdminMember[]
    },
    enabled: !!clubId,
  })
}
