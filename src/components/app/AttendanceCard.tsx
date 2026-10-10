import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMyAttendance } from '../../hooks/useAttendance'
import { Card, Eyebrow } from './ui'

// Student's own attendance: rate over the last 30 days, current streak and
// the last dozen marked sessions as dots (oldest left, newest right).
export function AttendanceCard({ memberId }: { memberId: string }) {
  const { t, i18n } = useTranslation()
  const { data: rows } = useMyAttendance(memberId)

  if (!rows) return null
  if (rows.length === 0) {
    return (
      <Card>
        <Eyebrow>{t('studentHome.attendance.title')}</Eyebrow>
        <p className="mt-2 text-sm text-muted">{t('studentHome.attendance.none')}</p>
      </Card>
    )
  }

  const since = new Date()
  since.setDate(since.getDate() - 30)
  const sinceIso = since.toISOString().slice(0, 10)
  const recent = rows.filter((r) => r.session_date >= sinceIso)
  const present = recent.filter((r) => r.status === 'present').length
  const rate = recent.length ? Math.round((present / recent.length) * 100) : null

  let streak = 0
  for (const r of rows) {
    if (r.status !== 'present') break
    streak += 1
  }

  const dots = rows.slice(0, 12).reverse()
  const last = rows[0]

  return (
    <Card className="relative overflow-hidden">
      <span
        className="pointer-events-none absolute -bottom-6 -right-2 font-brush text-[6rem] leading-none text-ink/5"
        aria-hidden="true"
      >
        稽
      </span>
      <Eyebrow>{t('studentHome.attendance.title')}</Eyebrow>
      <div className="relative mt-2 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-4xl font-bold leading-none text-ink">
            {rate == null ? '-' : `${rate}%`}
          </p>
          <p className="mt-1 text-xs text-muted">
            {t('studentHome.attendance.last30', { present, total: recent.length })}
          </p>
        </div>
        {streak > 1 && (
          <span className="rounded-full bg-jade px-3 py-1 font-display text-[11px] uppercase tracking-wide text-shiro">
            {t('studentHome.attendance.streak', { count: streak })}
          </span>
        )}
      </div>
      <div className="relative mt-4 flex gap-1.5">
        {dots.map((r, i) => (
          <motion.span
            key={`${r.session_date}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
            title={`${r.session_date}${r.class ? ` · ${r.class.title}` : ''}`}
            className={`h-3 flex-1 rounded-full ${r.status === 'present' ? 'bg-jade' : 'bg-aka/70'}`}
          />
        ))}
      </div>
      <p className="relative mt-3 text-[11px] text-muted-2">
        {t('studentHome.attendance.lastSession', {
          date: new Date(`${last.session_date}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
            day: 'numeric',
            month: 'short',
          }),
          status: t(`admin.attendance.${last.status}`),
        })}
      </p>
    </Card>
  )
}
