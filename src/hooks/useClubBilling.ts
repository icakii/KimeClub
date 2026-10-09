import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export interface ClubBilling {
  plan: string
  monthly_price_cents: number
  paid_until: string | null
}

export function useClubBilling(clubId: string | undefined) {
  return useQuery({
    queryKey: ['club-billing', clubId],
    queryFn: async (): Promise<ClubBilling> => {
      const { data, error } = await supabase
        .from('club_billing')
        .select('plan, monthly_price_cents, paid_until')
        .eq('club_id', clubId as string)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}
