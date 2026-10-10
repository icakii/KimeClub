import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdminMembers } from '../../hooks/useAdminMembers'
import { useAttendance, useMarkAttendance } from '../../hooks/useAttendance'
import { useClub } from '../../hooks/useClub'
import { useSchedule } from '../../hooks/useSchedule'

// 0 = Monday, matching the classes.weekday convention used everywhere else.
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function Attendance() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: classes } = useSchedule(club?.id)
  const { data: members } = useAdminMembers(club?.id)

  const [date, setDate] = useState(() => toISODate(new Date()))
  const [classId, setClassId] = useState<string>('')

  const weekday = mondayIndex(new Date(`${date}T00:00:00`))
  const classesThisDay = useMemo(
    () => (classes ?? []).filter((c) => c.weekday === weekday),
    [classes, weekday],
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

  const statusByMember = new Map((marked ?? []).map((row) => [row.member_id, row.status]))
  const weekdayNames = t('schedule.weekdays', { returnObjects: true }) as string[]

  return (
    <div className="px-6 py-6">
      <h1 className="font-display text-xl uppercase tracking-wide text-ink">
        {t('admin.attendance.title')}
      </h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.attendance.date')}
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
          />
        </label>

        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.attendance.class')}
          </span>
          <select
            value={selectedClass?.id ?? ''}
            onChange={(e) => setClassId(e.target.value)}
            className="mt-1 min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
          >
            {classesThisDay.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} — {weekdayNames[c.weekday]} {c.start_time.slice(0, 5)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {classesThisDay.length === 0 && (
        <p className="mt-6 text-sm text-muted">{t('admin.attendance.noClassesThisDay')}</p>
      )}

      {selectedClass && roster.length === 0 && (
        <p className="mt-6 text-sm text-muted">{t('admin.attendance.noRoster')}</p>
      )}

      {selectedClass && roster.length > 0 && (
        <div className="mt-4 max-w-lg overflow-hidden rounded-lg border border-line">
          {roster.map((member) => {
            const current = statusByMember.get(member.id)
            return (
              <div
                key={member.id}
                className="flex items-center justify-between border-b border-line bg-surface p-3 last:border-0"
              >
                <span className="text-sm text-ink">{member.full_name}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      markAttendance.mutate({ memberId: member.id, status: 'present' })
                    }
                    className={`min-h-9 rounded-md border px-3 text-xs uppercase tracking-wide ${
                      current === 'present'
                        ? 'border-aka bg-aka text-shiro'
                        : 'border-line text-muted'
                    }`}
                  >
                    {t('admin.attendance.present')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      markAttendance.mutate({ memberId: member.id, status: 'absent' })
                    }
                    className={`min-h-9 rounded-md border px-3 text-xs uppercase tracking-wide ${
                      current === 'absent'
                        ? 'border-ink bg-ink text-shiro'
                        : 'border-line text-muted'
                    }`}
                  >
                    {t('admin.attendance.absent')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
