import { useTranslation } from 'react-i18next'
import { useSchedule } from '../../hooks/useSchedule'

export function Schedule({ clubId }: { clubId: string | undefined }) {
  const { t } = useTranslation()
  const { data: classes, isLoading } = useSchedule(clubId)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]

  return (
    <section id="schedule" className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('schedule.title')}
        </h2>

        <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-surface">
          {isLoading && <p className="p-6 text-center text-muted">...</p>}

          {!isLoading && classes?.length === 0 && (
            <p className="p-6 text-center text-muted">-</p>
          )}

          {classes?.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
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
                  <p>
                    {t('schedule.beltRange', { min: cls.belt_min_rank, max: cls.belt_max_rank })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
