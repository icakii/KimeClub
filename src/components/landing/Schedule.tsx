import { useTranslation } from 'react-i18next'
import { useSchedule } from '../../hooks/useSchedule'

export function Schedule({ clubId }: { clubId: string | undefined }) {
  const { t } = useTranslation()
  const { data: classes, isLoading } = useSchedule(clubId)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]

  return (
    <section id="schedule" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {t('schedule.title')}
        </h2>

        {isLoading && <p className="mt-8 text-center text-muted">...</p>}
        {!isLoading && classes?.length === 0 && <p className="mt-8 text-center text-muted">-</p>}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes?.map((cls) => (
            <div
              key={cls.id}
              className="rounded-lg border border-line bg-surface p-6 transition-colors hover:border-aka-text/60"
            >
              <p className="font-display uppercase tracking-wide text-shiro">{cls.title}</p>
              <p className="mt-1 text-sm text-muted">{weekdays[cls.weekday]}</p>
              <p className="mt-4 font-display text-lg text-shiro">
                {cls.start_time.slice(0, 5)}
              </p>
              <p className="text-sm text-muted">
                {t('schedule.duration', { minutes: cls.duration_min })}
              </p>
              {cls.belt_min_rank !== null && cls.belt_max_rank !== null && (
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-2">
                  {t('schedule.beltRange', { min: cls.belt_min_rank, max: cls.belt_max_rank })}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
