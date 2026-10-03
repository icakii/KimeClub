import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClassNoticesInRange } from '../../hooks/useClassNotices'
import { useClub } from '../../hooks/useClub'
import { useSchedule } from '../../hooks/useSchedule'

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
  const { data: classes } = useSchedule(club?.id)

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const todayISO = toISODate(new Date())
  const [selectedDate, setSelectedDate] = useState(todayISO)

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
  const weekdaysFull = t('schedule.weekdays', { returnObjects: true }) as string[]

  const selectedWeekday = mondayIndex(new Date(selectedDate + 'T00:00:00'))
  const selectedClasses = (classes ?? []).filter((c) => c.weekday === selectedWeekday)
  const selectedNotices = (notices ?? []).filter((n) => n.effective_date === selectedDate)

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('schedule.title')}</h1>

      <div className="mt-4 flex items-center justify-between">
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
          const isSelected = iso === selectedDate

          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelectedDate(iso)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-md text-sm transition-colors ${
                isSelected ? 'bg-aka text-shiro' : isToday ? 'border border-aka-text text-ink' : 'text-ink'
              } ${!inMonth ? 'opacity-30' : ''}`}
            >
              {day.getDate()}
              {(hasClass || hasNotice) && (
                <span
                  className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-shiro' : hasNotice ? 'bg-aka' : 'bg-gold'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface p-4">
        <p className="font-display text-sm uppercase tracking-wide text-ink">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString(i18n.resolvedLanguage, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>

        {selectedClasses.length === 0 ? (
          <p className="mt-2 text-sm text-muted">{t('schedule.calendar.noClasses')}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {selectedClasses.map((cls) => {
              const notice = selectedNotices.find((n) => n.class_id === cls.id)
              return (
                <div key={cls.id} className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-ink">{cls.title}</p>
                      {notice && (
                        <span className="rounded-full bg-aka px-2 py-0.5 text-[10px] font-display uppercase tracking-wide text-shiro">
                          {t('studentHome.changed')}
                        </span>
                      )}
                    </div>
                    {notice && <p className="mt-1 text-sm text-aka-text">{notice.note}</p>}
                  </div>
                  <p className="shrink-0 text-sm text-muted">
                    {(notice?.new_start_time ?? cls.start_time).slice(0, 5)}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-3 text-xs text-muted-2">{weekdaysFull[selectedWeekday]}</p>
      </div>
    </div>
  )
}
