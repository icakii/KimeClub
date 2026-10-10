import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DAY_KANJI, PageHeader } from '../../components/app/ui'
import { DayDetailSheet } from '../../components/DayDetailSheet'
import { useClassNoticesInRange } from '../../hooks/useClassNotices'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { useMyCompetitionEntries } from '../../hooks/useCompetitions'
import { useNextClass } from '../../hooks/useNextClass'
import { useSchedule } from '../../hooks/useSchedule'
import { useDaySignups, useToggleSignup } from '../../hooks/useSessionSignup'

// Direction-aware slide: AnimatePresence passes the *current* direction to
// the exiting month via custom, so it leaves the way the user swiped.
const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
}
const lift = {
  enter: (d: number) => ({ opacity: 0, y: d * 8 }),
  center: { opacity: 1, y: 0 },
  exit: (d: number) => ({ opacity: 0, y: d * -8 }),
}

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
  const { data: myCompetitionEntries } = useMyCompetitionEntries(club?.id, member?.id)

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  // +1 when moving forward a month, -1 backward: drives the slide direction.
  const [direction, setDirection] = useState(1)
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
  const openCompetitionEntries = openDate
    ? (myCompetitionEntries ?? []).filter((e) => e.competition.event_date === openDate)
    : []

  const { data: signedUpClassIds } = useDaySignups(club?.id, member?.id, openDate)
  const toggleSignup = useToggleSignup(club?.id, member?.id, openDate)
  const canSignUp = !!openDate && openDate >= todayISO

  function shiftMonth(delta: 1 | -1) {
    setDirection(delta)
    setViewMonth(delta === 1 ? addDays(endOfMonth(viewMonth), 1) : addDays(startOfMonth(viewMonth), -1))
  }

  return (
    <div className="px-5 pb-6 pt-5">
      <PageHeader kanji="稽古" title={t('schedule.title')} />

      {nextClass && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex items-center gap-4 overflow-hidden rounded-2xl bg-ai p-4 text-shiro shadow-[0_20px_40px_-24px_rgba(31,51,82,0.85)]"
        >
          <span className="font-brush text-4xl leading-none text-kin">
            {DAY_KANJI[nextClass.class.weekday]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-shiro/60">
                {t('studentHome.nextClass')}
              </p>
              {nextClass.notice && (
                <span className="rounded-full bg-aka px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-shiro">
                  {t('studentHome.changed')}
                </span>
              )}
            </div>
            <p className="truncate font-display text-lg font-semibold uppercase tracking-wide">
              {nextClass.class.title}
            </p>
            <p className="text-xs text-shiro/75">
              {new Date(nextClass.date + 'T00:00:00').toLocaleDateString(i18n.resolvedLanguage, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              {nextClass.class.room && ` · ${nextClass.class.room}`}
            </p>
          </div>
          <p className="font-display text-2xl font-bold">
            {(nextClass.notice?.new_start_time ?? nextClass.class.start_time).slice(0, 5)}
          </p>
        </motion.div>
      )}

      <div className="mt-6 rounded-3xl border border-ink/10 bg-shiro/95 p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:border-aka-text hover:text-aka-text active:scale-95"
            aria-label="Previous month"
          >
            ←
          </button>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.p
              key={viewMonth.toISOString()}
              custom={direction}
              variants={lift}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="font-display text-lg font-semibold uppercase tracking-wide text-ink"
            >
              {viewMonth.toLocaleDateString(i18n.resolvedLanguage, { month: 'long', year: 'numeric' })}
            </motion.p>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:border-aka-text hover:text-aka-text active:scale-95"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {weekdaysShort.map((d, i) => (
            <div key={d} className="flex flex-col items-center py-1">
              <span className="font-brush text-sm leading-none text-ink/70">{DAY_KANJI[i]}</span>
              <span className="mt-0.5 text-[9px] uppercase tracking-wide text-muted">{d}</span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={viewMonth.toISOString()}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-7 gap-1"
            >
              {days.map((day) => {
                const iso = toISODate(day)
                const weekday = mondayIndex(day)
                const inMonth = day.getMonth() === viewMonth.getMonth()
                const hasClass = (classes ?? []).some((c) => c.weekday === weekday)
                const hasNotice = (notices ?? []).some((n) => n.effective_date === iso)
                const hasCompetition = (myCompetitionEntries ?? []).some(
                  (e) => e.competition.event_date === iso,
                )
                const isToday = iso === todayISO
                const isOpen = iso === openDate

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setOpenDate(iso)}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 active:scale-90 ${
                      isOpen
                        ? 'bg-aka font-semibold text-shiro shadow-[0_8px_16px_-8px_rgba(194,54,31,0.9)]'
                        : isToday
                          ? 'bg-ai font-semibold text-shiro'
                          : hasClass
                            ? 'bg-kuro text-ink hover:bg-surface'
                            : 'text-ink hover:bg-kuro'
                    } ${!inMonth ? 'opacity-30' : ''}`}
                  >
                    {day.getDate()}
                    {hasCompetition && <span className="absolute right-0.5 top-0.5 text-[10px]">🏆</span>}
                    {(hasClass || hasNotice) && (
                      <span
                        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                          isOpen || isToday ? 'bg-shiro' : hasNotice ? 'bg-aka' : 'bg-kin'
                        }`}
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DayDetailSheet
        date={openDate}
        classes={openClasses}
        notices={openNotices}
        onClose={() => setOpenDate(null)}
        signedUpClassIds={signedUpClassIds ?? []}
        onToggleSignup={(classId, signedUp) => toggleSignup.mutate({ classId, signedUp })}
        canSignUp={canSignUp}
        myCompetitionEntries={openCompetitionEntries}
      />
    </div>
  )
}
