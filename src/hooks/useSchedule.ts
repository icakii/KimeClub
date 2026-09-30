import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface ClassRow {
  id: string
  title: string
  weekday: number
  start_time: string
  duration_min: number
  belt_min_rank: number | null
  belt_max_rank: number | null
}

export function useSchedule(clubId: string | undefined) {
  return useQuery({
    queryKey: ['schedule', clubId],
    queryFn: async (): Promise<ClassRow[]> => {
      const { data, error } = await supabase
        .from('classes')
        .select('id, title, weekday, start_time, duration_min, belt_min_rank, belt_max_rank')
        .eq('club_id', clubId as string)
        .order('weekday')
        .order('start_time')
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}
