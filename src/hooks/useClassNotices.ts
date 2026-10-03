import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { ClassNotice } from './useNextClass'

export function useClassNoticesInRange(
  clubId: string | undefined,
  startDate: string,
  endDate: string,
) {
  return useQuery({
    queryKey: ['class_notices_range', clubId, startDate, endDate],
    queryFn: async (): Promise<ClassNotice[]> => {
      const { data, error } = await supabase
        .from('class_notices')
        .select('class_id, effective_date, new_start_time, note')
        .eq('club_id', clubId as string)
        .gte('effective_date', startDate)
        .lte('effective_date', endDate)
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}
