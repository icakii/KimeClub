import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSchedule, type ClassRow } from './useSchedule'

export interface ClassNotice {
  class_id: string
  effective_date: string
  new_start_time: string | null
  note: string
}

function useUpcomingNotices(clubId: string | undefined) {
  return useQuery({
    queryKey: ['class_notices', clubId],
    queryFn: async (): Promise<ClassNotice[]> => {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('class_notices')
        .select('class_id, effective_date, new_start_time, note')
        .eq('club_id', clubId as string)
        .gte('effective_date', today)
      if (error) throw error
      return data
    },
    enabled: !!clubId,
  })
}

function nextOccurrenceDate(weekday: number, startTime: string, now: Date): Date {
  const currentWeekday = (now.getDay() + 6) % 7 // 0 = Monday, matches the DB convention
  const currentTime = now.toTimeString().slice(0, 8)

  let daysUntil = weekday - currentWeekday
  if (daysUntil < 0) daysUntil += 7
  if (daysUntil === 0 && startTime <= currentTime) daysUntil = 7

  const result = new Date(now)
  result.setDate(result.getDate() + daysUntil)
  return result
}

export interface NextClass {
  class: ClassRow
  date: string
  notice: ClassNotice | null
}

export function useNextClass(clubId: string | undefined): NextClass | null {
  const { data: classes } = useSchedule(clubId)
  const { data: notices } = useUpcomingNotices(clubId)

  return useMemo(() => {
    if (!classes || classes.length === 0) return null

    const now = new Date()
    const withDates = classes.map((cls) => ({
      cls,
      date: nextOccurrenceDate(cls.weekday, cls.start_time, now),
    }))
    withDates.sort((a, b) => a.date.getTime() - b.date.getTime())
    const soonest = withDates[0]
    const dateStr = soonest.date.toISOString().slice(0, 10)

    const notice =
      notices?.find((n) => n.class_id === soonest.cls.id && n.effective_date === dateStr) ?? null

    return { class: soonest.cls, date: dateStr, notice }
  }, [classes, notices])
}
