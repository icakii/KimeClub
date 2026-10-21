import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

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
