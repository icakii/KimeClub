import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface Belt {
  id: string
  rank: number
  name_bg: string
  name_en: string
  color_hex: string
  color2_hex: string | null
  grade_bg: string | null
  grade_en: string | null
}

export function useBelts(clubId: string | undefined) {
  return useQuery({
    queryKey: ['belts', clubId],
    queryFn: async (): Promise<Belt[]> => {
      const { data, error } = await supabase
        .from('belts')
        .select('id, rank, name_bg, name_en, color_hex, color2_hex, grade_bg, grade_en')
        .eq('club_id', clubId as string)
        .order('rank')
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}
