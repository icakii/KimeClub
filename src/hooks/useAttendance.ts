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
    // Takes a list so "mark everyone present" is one round trip.
    mutationFn: async ({
      memberIds,
      status,
    }: {
      memberIds: string[]
      status: 'present' | 'absent'
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from('attendance').upsert(
        memberIds.map((memberId) => ({
          club_id: clubId,
          class_id: classId,
          member_id: memberId,
          session_date: sessionDate,
          status,
          marked_by: user?.id ?? null,
        })),
        { onConflict: 'class_id,member_id,session_date' },
      )
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', clubId, classId, sessionDate] })
      queryClient.invalidateQueries({ queryKey: ['attendance-history', clubId] })
    },
  })
}

export interface AttendanceHistoryRow {
  member_id: string
  status: 'present' | 'absent'
  session_date: string
}

// Every marked session since a date, for the per-student summary.
export function useAttendanceHistory(clubId: string | undefined, since: string) {
  return useQuery({
    queryKey: ['attendance-history', clubId, since],
    queryFn: async (): Promise<AttendanceHistoryRow[]> => {
      const { data, error } = await supabase
        .from('attendance')
        .select('member_id, status, session_date')
        .eq('club_id', clubId as string)
        .gte('session_date', since)
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}

export interface MyAttendanceRow {
  status: 'present' | 'absent'
  session_date: string
  class: { title: string } | null
}

// A student's own history; RLS only returns their rows.
export function useMyAttendance(memberId: string | undefined) {
  return useQuery({
    queryKey: ['my-attendance', memberId],
    queryFn: async (): Promise<MyAttendanceRow[]> => {
      const { data, error } = await supabase
        .from('attendance')
        .select('status, session_date, class:classes(title)')
        .eq('member_id', memberId as string)
        .order('session_date', { ascending: false })
        .limit(60)
      if (error) throw error
      return data as unknown as MyAttendanceRow[]
    },
    enabled: !!memberId,
  })
}
