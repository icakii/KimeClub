import { useTranslation } from 'react-i18next'
import { useClub } from '../../hooks/useClub'
import { useSchedule } from '../../hooks/useSchedule'

export function Schedule() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: classes, isLoading } = useSchedule(club?.id)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('schedule.title')}</h1>

      <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
        {isLoading && <p className="p-6 text-center text-muted">...</p>}
        {classes?.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-display uppercase tracking-wide text-shiro">{cls.title}</p>
              <p className="text-sm text-muted">{weekdays[cls.weekday]}</p>
            </div>
            <div className="text-right text-sm text-muted">
              <p>
                {cls.start_time.slice(0, 5)} ·{' '}
                {t('schedule.duration', { minutes: cls.duration_min })}
              </p>
              {cls.belt_min_rank !== null && cls.belt_max_rank !== null && (
                <p>{t('schedule.beltRange', { min: cls.belt_min_rank, max: cls.belt_max_rank })}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
