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
  group_id: string | null
  // Hall/room: the class's own, else its group's.
  room: string | null
}

// groupId filters to that group's classes plus any ungrouped (visible to
// everyone) class. Omit it to see every class regardless of group — used
// by the public landing page, and as a fallback for a student who hasn't
// been assigned a group yet.
export function useSchedule(clubId: string | undefined, groupId?: string | null) {
  return useQuery({
    queryKey: ['schedule', clubId, groupId],
    queryFn: async (): Promise<ClassRow[]> => {
      let query = supabase
        .from('classes')
        .select(
          'id, title, weekday, start_time, duration_min, belt_min_rank, belt_max_rank, group_id, room, group:groups(room)',
        )
        .eq('club_id', clubId as string)

      if (groupId) {
        query = query.or(`group_id.is.null,group_id.eq.${groupId}`)
      }

      const { data, error } = await query.order('weekday').order('start_time')
      if (error) throw error
      return (data as unknown as (Omit<ClassRow, 'room'> & { room: string | null; group: { room: string | null } | null })[]).map(
        ({ group, ...cls }) => ({ ...cls, room: cls.room ?? group?.room ?? null }),
      )
    },
    enabled: !!clubId,
  })
}
