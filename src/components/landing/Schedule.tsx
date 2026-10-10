import { useTranslation } from 'react-i18next'
import { useBelts } from '../../hooks/useBelts'
import { useSchedule } from '../../hooks/useSchedule'
import { rankRangeLabel } from '../../lib/belts'
import { Reveal, SectionHeading } from './Section'

// Japanese weekday kanji, Monday-first to match classes.weekday (0 = Mon).
const DAY_KANJI = ['月', '火', '水', '木', '金', '土', '日']
const DAY_TONE = ['text-ai', 'text-aka', 'text-ai-soft', 'text-jade', 'text-kin', 'text-gold', 'text-aka-text']

export function Schedule({ clubId }: { clubId: string | undefined }) {
  const { t, i18n } = useTranslation()
  const { data: classes, isLoading } = useSchedule(clubId)
  const { data: belts } = useBelts(clubId)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]

  return (
    <section id="schedule" className="scroll-mt-20 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="稽古" title={t('schedule.title')} tone="aka" />

        {isLoading && <p className="mt-10 text-center text-muted">...</p>}
        {!isLoading && classes?.length === 0 && <p className="mt-10 text-center text-muted">-</p>}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classes?.map((cls, i) => (
            <Reveal key={cls.id} delay={i * 0.08}>
              <div className="group flex h-full items-stretch overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 shadow-[0_20px_40px_-28px_rgba(31,27,22,0.5)] transition-all duration-300 hover:-translate-y-1.5">
                <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r border-ink/10 bg-kuro/60">
                  <span
                    className={`font-brush text-5xl leading-none transition-transform duration-500 group-hover:scale-110 ${DAY_TONE[cls.weekday]}`}
                  >
                    {DAY_KANJI[cls.weekday]}
                  </span>
                  <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
                    {weekdays[cls.weekday]?.slice(0, 3)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {cls.title}
                  </p>
                  <p className="text-sm text-muted">
                    {weekdays[cls.weekday]}
                    {cls.room && <span className="ml-2 rounded-full bg-ai/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-ai">{cls.room}</span>}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div>
                      <p className="font-display text-3xl font-bold leading-none text-ink">
                        {cls.start_time.slice(0, 5)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {t('schedule.duration', { minutes: cls.duration_min })}
                      </p>
                    </div>
                    {cls.belt_min_rank !== null && cls.belt_max_rank !== null && (
                      <span className="rounded-full bg-ink px-3 py-1 text-[10px] uppercase tracking-wide text-shiro">
                        {t('schedule.beltRange', { range: rankRangeLabel(belts, cls.belt_min_rank, cls.belt_max_rank, i18n.resolvedLanguage) })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
