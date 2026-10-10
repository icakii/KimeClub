import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// The member's own signups for a single day — usually 0-2 rows (one per
// class scheduled that day), keyed by class_id for quick lookup.
export function useDaySignups(
  clubId: string | undefined,
  memberId: string | undefined,
  sessionDate: string | null,
) {
  return useQuery({
    queryKey: ['session-signups', clubId, memberId, sessionDate],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('session_signups')
        .select('class_id')
        .eq('club_id', clubId as string)
        .eq('member_id', memberId as string)
        .eq('session_date', sessionDate as string)
      if (error) throw error
      return data.map((row) => row.class_id)
    },
    enabled: !!clubId && !!memberId && !!sessionDate,
  })
}

export function useToggleSignup(
  clubId: string | undefined,
  memberId: string | undefined,
  sessionDate: string | null,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ classId, signedUp }: { classId: string; signedUp: boolean }) => {
      if (signedUp) {
        const { error } = await supabase
          .from('session_signups')
          .delete()
          .eq('club_id', clubId as string)
          .eq('member_id', memberId as string)
          .eq('class_id', classId)
          .eq('session_date', sessionDate as string)
        if (error) throw error
        return
      }

      const { error } = await supabase.from('session_signups').insert({
        club_id: clubId,
        member_id: memberId,
        class_id: classId,
        session_date: sessionDate,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session-signups', clubId, memberId, sessionDate],
      })
    },
  })
}
