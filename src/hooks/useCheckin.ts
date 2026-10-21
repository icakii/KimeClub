import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// The hall's QR code: staff fetch (and can replace) the club's secret code;
// a student who scans it lands on /checkin/<code>, which calls qr_check_in.
export function useCheckinToken(clubId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['checkin-token', clubId],
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase.rpc('club_checkin_token', { p_club_id: clubId })
      if (error) throw error
      return data as string
    },
    enabled: !!clubId && enabled,
    staleTime: Infinity,
  })
}

export function useRotateCheckinToken(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('rotate_checkin_token', { p_club_id: clubId })
      if (error) throw error
      return data as string
    },
    onSuccess: (token) => queryClient.setQueryData(['checkin-token', clubId], token),
  })
}

export interface CheckinResult {
  status: 'ok' | 'already'
  title: string
  start_time: string
}

export type CheckinError = 'bad_code' | 'not_member' | 'no_class' | 'unknown'

export function useCheckIn() {
  return useMutation({
    mutationFn: async (token: string): Promise<CheckinResult> => {
      const { data, error } = await supabase.rpc('qr_check_in', { p_token: token })
      if (error) {
        const known = (['bad_code', 'not_member', 'no_class'] as const).find((c) => error.message.includes(c))
        throw new Error(known ?? 'unknown')
      }
      return data as CheckinResult
    },
  })
}
