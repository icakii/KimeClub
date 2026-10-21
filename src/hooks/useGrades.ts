import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { localISODate } from '../lib/date'

// Star grades (1-5) a coach gives a student, when the club has the option.
// RLS: staff see the whole club, a student only their own.
export interface Grade {
  id: string
  member_id: string
  stars: number
  note: string | null
  given_on: string
}

export function useMemberGrades(memberId: string | undefined) {
  return useQuery({
    queryKey: ['grades', memberId],
    queryFn: async (): Promise<Grade[]> => {
      const { data, error } = await supabase
        .from('member_grades')
        .select('id, member_id, stars, note, given_on')
        .eq('member_id', memberId as string)
        .order('given_on', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
    enabled: !!memberId,
  })
}

// Average per student for the members list.
export function useClubGradeAverages(clubId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['grade-averages', clubId],
    queryFn: async (): Promise<Record<string, { avg: number; count: number }>> => {
      const { data, error } = await supabase.from('member_grades').select('member_id, stars').eq('club_id', clubId as string)
      if (error) throw error
      const sums: Record<string, { sum: number; count: number }> = {}
      for (const g of data) {
        const s = (sums[g.member_id] ??= { sum: 0, count: 0 })
        s.sum += g.stars
        s.count += 1
      }
      return Object.fromEntries(Object.entries(sums).map(([id, s]) => [id, { avg: s.sum / s.count, count: s.count }]))
    },
    enabled: !!clubId && enabled,
  })
}

export function useAddGrade(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ memberId, stars, note }: { memberId: string; stars: number; note: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { error } = await supabase.from('member_grades').insert({
        club_id: clubId,
        member_id: memberId,
        stars,
        note: note.trim() || null,
        given_on: localISODate(),
        given_by: user?.id,
      })
      if (error) throw error
    },
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ['grades', v.memberId] })
      queryClient.invalidateQueries({ queryKey: ['grade-averages', clubId] })
    },
  })
}

export function useDeleteGrade(clubId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (grade: Grade) => {
      const { error } = await supabase.from('member_grades').delete().eq('id', grade.id)
      if (error) throw error
    },
    onSuccess: (_d, g) => {
      queryClient.invalidateQueries({ queryKey: ['grades', g.member_id] })
      queryClient.invalidateQueries({ queryKey: ['grade-averages', clubId] })
    },
  })
}
