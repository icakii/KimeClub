import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MemberAvatar } from '../../components/admin/MemberAvatar'
import { StatCard } from '../../components/admin/ui'
import { useGroups } from '../../hooks/useClubAdmin'
import { DAY_KANJI, PageHeader } from '../../components/app/ui'
import { useAdminMembers } from '../../hooks/useAdminMembers'
import { useAttendance, useAttendanceHistory, useMarkAttendance } from '../../hooks/useAttendance'
import { useClub } from '../../hooks/useClub'
import { useSchedule } from '../../hooks/useSchedule'

// 0 = Monday, matching the classes.weekday convention used everywhere else.
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function Attendance() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: classes } = useSchedule(club?.id)
  const { data: members } = useAdminMembers(club?.id)

  const [date, setDate] = useState(() => toISODate(new Date()))
  const [classId, setClassId] = useState<string>('')
  // Filter the day's classes and the 30-day summary by group and by hall.
  const [groupFilter, setGroupFilter] = useState<string>('')
  const [hallFilter, setHallFilter] = useState<string>('')
  const { data: groups } = useGroups(club?.id)
  const halls = useMemo(() => [...new Set((classes ?? []).map((c) => c.room).filter((r): r is string => !!r))], [classes])

  const weekday = mondayIndex(new Date(`${date}T00:00:00`))
  const classesThisDay = useMemo(
    () =>
      (classes ?? []).filter(
        (c) =>
          c.weekday === weekday &&
          (!groupFilter || c.group_id === groupFilter) &&
          (!hallFilter || c.room === hallFilter),
      ),
    [classes, weekday, groupFilter, hallFilter],
  )
  const selectedClass = classesThisDay.find((c) => c.id === classId) ?? classesThisDay[0]

  const roster = useMemo(() => {
    if (!selectedClass) return []
    return (members ?? []).filter(
      (m) =>
        m.role === 'student' &&
        m.status !== 'left' &&
        (!selectedClass.group_id || m.group_id === selectedClass.group_id),
    )
  }, [members, selectedClass])

  const { data: marked } = useAttendance(club?.id, selectedClass?.id, date)
  const markAttendance = useMarkAttendance(club?.id, selectedClass?.id, date)

  const since = useMemo(() => shiftDays(toISODate(new Date()), -30), [])
  const { data: history } = useAttendanceHistory(club?.id, since)

  const statusByMember = new Map((marked ?? []).map((row) => [row.member_id, row.status]))
  const presentCount = roster.filter((m) => statusByMember.get(m.id) === 'present').length
  const absentCount = roster.filter((m) => statusByMember.get(m.id) === 'absent').length

  const summary = useMemo(() => {
    const byMember = new Map<string, { present: number; total: number }>()
    for (const row of history ?? []) {
      const s = byMember.get(row.member_id) ?? { present: 0, total: 0 }
      s.total += 1
      if (row.status === 'present') s.present += 1
      byMember.set(row.member_id, s)
    }
    return (members ?? [])
      .filter((m) => m.role === 'student' && m.status !== 'left' && (!groupFilter || m.group_id === groupFilter))
      .map((m) => ({ member: m, ...(byMember.get(m.id) ?? { present: 0, total: 0 }) }))
      .sort((a, b) => b.present / (b.total || 1) - a.present / (a.total || 1))
  }, [history, members, groupFilter])

  const weekdayNames = t('schedule.weekdays', { returnObjects: true }) as string[]
  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="出" title={t('admin.attendance.title')} />

      {/* Day picker: step through days, the kanji shows the weekday at a glance. */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-2xl border border-ink/10 bg-shiro/95 p-1.5">
          <button
            type="button"
            onClick={() => setDate((d) => shiftDays(d, -1))}
            className="h-10 w-10 rounded-xl text-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Previous day"
          >
            ‹
          </button>
          <label className="relative flex items-center gap-2 px-2">
            <span className="rounded-sm bg-aka px-1.5 py-0.5 font-brush text-base leading-none text-shiro">
              {DAY_KANJI[weekday]}
            </span>
            <span className="font-display text-sm uppercase tracking-wide text-ink">
              {weekdayNames[weekday]}, {dateLabel}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label={t('admin.attendance.date')}
            />
          </label>
          <button
            type="button"
            onClick={() => setDate((d) => shiftDays(d, 1))}
            className="h-10 w-10 rounded-xl text-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Next day"
          >
            ›
          </button>
        </div>
        {date !== toISODate(new Date()) && (
          <button
            type="button"
            onClick={() => setDate(toISODate(new Date()))}
            className="font-display text-xs uppercase tracking-wide text-aka-text"
          >
            {t('admin.attendance.today')}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-display uppercase tracking-[0.2em] text-muted">{t('admin.attendance.filterGroup')}</span>
        {[{ id: '', name: t('admin.attendance.all') }, ...(groups ?? [])].map((g) => (
          <button
            key={g.id || 'all'}
            type="button"
            onClick={() => setGroupFilter(g.id)}
            className={`rounded-full px-3 py-1.5 font-display uppercase tracking-wide transition-colors ${
              groupFilter === g.id ? 'bg-ink text-shiro' : 'border border-ink/15 text-muted hover:text-ink'
            }`}
          >
            {g.name}
          </button>
        ))}
        {halls.length > 0 && (
          <>
            <span className="ml-2 font-display uppercase tracking-[0.2em] text-muted">{t('admin.attendance.filterHall')}</span>
            {['', ...halls].map((h) => (
              <button
                key={h || 'all-halls'}
                type="button"
                onClick={() => setHallFilter(h)}
                className={`rounded-full px-3 py-1.5 font-display uppercase tracking-wide transition-colors ${
                  hallFilter === h ? 'bg-kin text-ink' : 'border border-ink/15 text-muted hover:text-ink'
                }`}
              >
                {h || t('admin.attendance.all')}
              </button>
            ))}
          </>
        )}
      </div>

      {classesThisDay.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {classesThisDay.map((c) => {
            const active = c.id === selectedClass?.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setClassId(c.id)}
                className={`rounded-full px-4 py-2 font-display text-xs uppercase tracking-wide transition-colors ${
                  active ? 'bg-ai text-shiro' : 'border border-ink/15 bg-shiro/95 text-muted hover:text-ink'
                }`}
              >
                {c.start_time.slice(0, 5)} · {c.title}
                {c.room && <span className="opacity-60"> · {c.room}</span>}
              </button>
            )
          })}
        </div>
      )}

      {classesThisDay.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-ink/20 bg-shiro/70 p-6 text-center text-sm text-muted">
          {t('admin.attendance.noClassesThisDay')}
        </div>
      )}

      {selectedClass && roster.length === 0 && (
        <p className="mt-6 text-sm text-muted">{t('admin.attendance.noRoster')}</p>
      )}

      {selectedClass && roster.length > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-4 py-3">
              <p className="font-display text-sm uppercase tracking-wide text-ink">
                {t('admin.attendance.marked', { present: presentCount, total: roster.length })}
              </p>
              <button
                type="button"
                disabled={markAttendance.isPending || presentCount + absentCount === roster.length}
                onClick={() =>
                  markAttendance.mutate({
                    memberIds: roster.filter((m) => !statusByMember.has(m.id)).map((m) => m.id),
                    status: 'present',
                  })
                }
                className="rounded-full bg-jade px-4 py-2 font-display text-[11px] uppercase tracking-wide text-shiro transition-transform active:scale-95 disabled:opacity-50"
              >
                {t('admin.attendance.markRest')}
              </button>
            </div>
            {/* Progress strip: green for present, red for absent. */}
            <div className="flex h-1 bg-ink/5">
              <motion.span
                className="bg-jade"
                animate={{ width: `${(presentCount / roster.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
              <motion.span
                className="bg-aka"
                animate={{ width: `${(absentCount / roster.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </div>
            {roster.map((member) => {
              const current = statusByMember.get(member.id)
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-shiro transition-colors ${
                        current === 'present' ? 'ring-jade' : current === 'absent' ? 'ring-aka' : 'ring-transparent'
                      }`}
                    >
                      <MemberAvatar
                        name={member.full_name}
                        photoPath={member.photo_path}
                        tone={current === 'present' ? 'bg-jade' : current === 'absent' ? 'bg-aka' : 'bg-muted'}
                        className="h-9 w-9 text-xs"
                      />
                    </span>
                    <span className="truncate text-sm text-ink">{member.full_name}</span>
                  </div>
                  <div className="flex shrink-0 rounded-full bg-ink/5 p-1">
                    {(['present', 'absent'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => markAttendance.mutate({ memberIds: [member.id], status })}
                        className={`relative min-h-8 rounded-full px-3 font-display text-[11px] uppercase tracking-wide transition-colors ${
                          current === status ? 'text-shiro' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {current === status && (
                          <motion.span
                            layoutId={`att-${member.id}`}
                            className={`absolute inset-0 rounded-full ${status === 'present' ? 'bg-jade' : 'bg-aka'}`}
                            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                          />
                        )}
                        <span className="relative">{t(`admin.attendance.${status}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:content-start">
            <StatCard
              label={t('admin.attendance.present')}
              value={`${presentCount} / ${roster.length}`}
              kanji="出"
              tone="bg-jade"
            />
            <StatCard label={t('admin.attendance.absent')} value={absentCount} kanji="欠" tone="bg-aka" />
          </div>
        </div>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          {t('admin.attendance.last30')}
        </h2>
        {summary.some((s) => s.total > 0) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {summary.map(({ member, present, total }) => {
            const rate = total ? Math.round((present / total) * 100) : null
            return (
              <div
                key={member.id}
                className="rounded-2xl border border-ink/10 bg-shiro/95 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-ink">{member.full_name}</span>
                  <span className="shrink-0 font-display text-ink">
                    {rate == null ? '-' : `${rate}%`}
                    <span className="ml-2 text-xs text-muted">
                      {present}/{total}
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                  <motion.div
                    className={`h-full rounded-full ${rate != null && rate < 50 ? 'bg-aka' : 'bg-jade'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${rate ?? 0}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        )}
        {summary.every((s) => s.total === 0) && (
          <p className="mt-2 text-sm text-muted">{t('admin.attendance.noHistory')}</p>
        )}
      </section>
    </div>
  )
}
