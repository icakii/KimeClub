import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DayDetailSheet } from '../../components/DayDetailSheet'
import { useClassNoticesInRange } from '../../hooks/useClassNotices'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { useNextClass } from '../../hooks/useNextClass'
import { useSchedule } from '../../hooks/useSchedule'
import { useDaySignups, useToggleSignup } from '../../hooks/useSessionSignup'

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function toISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
// 0 = Monday, matching the classes.weekday convention used everywhere else.
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function Schedule() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: classes } = useSchedule(club?.id, member?.group_id)
  const nextClass = useNextClass(club?.id, member?.group_id)

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const todayISO = toISODate(new Date())
  // null = sheet closed. Tapping a day opens it instead of pushing a panel
  // below the grid, so you don't have to scroll down and back up to check
  // another day.
  const [openDate, setOpenDate] = useState<string | null>(null)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const gridStart = addDays(monthStart, -mondayIndex(monthStart))
  const gridEnd = addDays(monthEnd, 6 - mondayIndex(monthEnd))

  const { data: notices } = useClassNoticesInRange(
    club?.id,
    toISODate(gridStart),
    toISODate(gridEnd),
  )

  const days: Date[] = []
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d)
  }

  const weekdaysShort = t('schedule.weekdaysShort', { returnObjects: true }) as string[]

  const openWeekday = openDate ? mondayIndex(new Date(openDate + 'T00:00:00')) : null
  const openClasses =
    openWeekday === null ? [] : (classes ?? []).filter((c) => c.weekday === openWeekday)
  const openNotices = openDate ? (notices ?? []).filter((n) => n.effective_date === openDate) : []

  const { data: signedUpClassIds } = useDaySignups(club?.id, member?.id, openDate)
  const toggleSignup = useToggleSignup(club?.id, member?.id, openDate)
  const canSignUp = !!openDate && openDate >= todayISO

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('schedule.title')}</h1>

      {nextClass && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted">
              {t('studentHome.nextClass')}
            </p>
            {nextClass.notice && (
              <span className="rounded-full bg-aka px-2 py-0.5 text-[10px] font-display uppercase tracking-wide text-shiro">
                {t('studentHome.changed')}
              </span>
            )}
          </div>
          <p className="mt-1 font-display uppercase tracking-wide text-ink">
            {nextClass.class.title}
          </p>
          <p className="text-sm text-muted">
            {new Date(nextClass.date + 'T00:00:00').toLocaleDateString(i18n.resolvedLanguage, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            · {(nextClass.notice?.new_start_time ?? nextClass.class.start_time).slice(0, 5)}
          </p>
          {nextClass.notice && (
            <p className="mt-1 text-sm text-aka-text">{nextClass.notice.note}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(addDays(startOfMonth(viewMonth), -1))}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display uppercase tracking-wide text-ink">
          {viewMonth.toLocaleDateString(i18n.resolvedLanguage, { month: 'long', year: 'numeric' })}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth(addDays(endOfMonth(viewMonth), 1))}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-muted">
        {weekdaysShort.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const iso = toISODate(day)
          const weekday = mondayIndex(day)
          const inMonth = day.getMonth() === viewMonth.getMonth()
          const hasClass = (classes ?? []).some((c) => c.weekday === weekday)
          const hasNotice = (notices ?? []).some((n) => n.effective_date === iso)
          const isToday = iso === todayISO
          const isOpen = iso === openDate

          return (
            <button
              key={iso}
              type="button"
              onClick={() => setOpenDate(iso)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-md text-sm transition-colors ${
                isOpen ? 'bg-aka text-shiro' : isToday ? 'border border-aka-text text-ink' : 'text-ink'
              } ${!inMonth ? 'opacity-30' : ''}`}
            >
              {day.getDate()}
              {(hasClass || hasNotice) && (
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                    isOpen ? 'bg-shiro' : hasNotice ? 'bg-aka' : 'bg-gold'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      <DayDetailSheet
        date={openDate}
        classes={openClasses}
        notices={openNotices}
        onClose={() => setOpenDate(null)}
        signedUpClassIds={signedUpClassIds ?? []}
        onToggleSignup={(classId, signedUp) => toggleSignup.mutate({ classId, signedUp })}
        canSignUp={canSignUp}
      />
    </div>
  )
}
