import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface Notification {
  id: string
  title: string
  body: string
  created_at: string
  read_at: string | null
}

export function useNotifications(memberId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', memberId],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, body, created_at, read_at')
        .eq('member_id', memberId as string)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!memberId,
  })
}
