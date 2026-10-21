import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Store reservations: a logged-in student reserves an item, the coach sees
// it with the child's details and hands it over at the hall.
export type ReservationStatus = 'new' | 'ready' | 'done' | 'cancelled'

export interface Reservation {
  id: string
  member_id: string
  item_key: string
  item_name: string
  size: string | null
  price_cents: number
  height_cm: number | null
  weight_kg: number | null
  note: string | null
  status: ReservationStatus
  created_at: string
}

export interface StaffReservation extends Reservation {
  member: {
    full_name: string
    birth_year: number | null
    phone: string | null
    guardian_first_name: string | null
    guardian_last_name: string | null
    guardian_phone: string | null
    group: { name: string } | null
  } | null
}

const COLUMNS = 'id, member_id, item_key, item_name, size, price_cents, height_cm, weight_kg, note, status, created_at'

export function useClubReservations(clubId: string | undefined) {
  return useQuery({
    queryKey: ['reservations', clubId],
    queryFn: async (): Promise<StaffReservation[]> => {
      const { data, error } = await supabase
        .from('store_reservations')
        .select(
          `${COLUMNS}, member:members(full_name, birth_year, phone, guardian_first_name, guardian_last_name, guardian_phone, group:groups(name))`,
        )
        .eq('club_id', clubId as string)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) throw error
      return data as unknown as StaffReservation[]
    },
    enabled: !!clubId,
  })
}

export function useMyReservations(memberId: string | undefined) {
  return useQuery({
    queryKey: ['my-reservations', memberId],
    queryFn: async (): Promise<Reservation[]> => {
      const { data, error } = await supabase
        .from('store_reservations')
        .select(COLUMNS)
        .eq('member_id', memberId as string)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!memberId,
  })
}

export interface NewReservation {
  item_key: string
  item_name: string
  size: string | null
  price_cents: number
  height_cm: number | null
  weight_kg: number | null
  note: string | null
}

export function useReserve(clubId: string | undefined, memberId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (r: NewReservation) => {
      const { error } = await supabase.from('store_reservations').insert({ ...r, club_id: clubId, member_id: memberId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-reservations', memberId] }),
  })
}

export function useCancelMyReservation(memberId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('store_reservations').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-reservations', memberId] }),
  })
}

export function useSetReservationStatus(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      const { error } = await supabase
        .from('store_reservations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservations', clubId] }),
  })
}
