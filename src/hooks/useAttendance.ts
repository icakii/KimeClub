import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface AttendanceRow {
  member_id: string
  status: 'present' | 'absent'
}

export function useAttendance(
  clubId: string | undefined,
  classId: string | undefined,
  sessionDate: string,
) {
  return useQuery({
    queryKey: ['attendance', clubId, classId, sessionDate],
    queryFn: async (): Promise<AttendanceRow[]> => {
      const { data, error } = await supabase
        .from('attendance')
        .select('member_id, status')
        .eq('club_id', clubId as string)
        .eq('class_id', classId as string)
        .eq('session_date', sessionDate)
      if (error) throw error
      return data
    },
    enabled: !!clubId && !!classId && !!sessionDate,
  })
}

export function useMarkAttendance(
  clubId: string | undefined,
  classId: string | undefined,
  sessionDate: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      memberId,
      status,
    }: {
      memberId: string
      status: 'present' | 'absent'
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from('attendance').upsert(
        {
          club_id: clubId,
          class_id: classId,
          member_id: memberId,
          session_date: sessionDate,
          status,
          marked_by: user?.id ?? null,
        },
        { onConflict: 'class_id,member_id,session_date' },
      )
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', clubId, classId, sessionDate] })
    },
  })
}
