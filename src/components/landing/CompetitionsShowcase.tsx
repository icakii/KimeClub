import { useTranslation } from 'react-i18next'

const POINTS = ['entries', 'results', 'medals'] as const

export function CompetitionsShowcase() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 mx-auto w-full max-w-xs lg:order-1">
          <div className="rounded-[2.5rem] border-[10px] border-ink bg-ink p-2 shadow-xl">
            <div className="rounded-[1.75rem] bg-surface p-5">
              <p className="font-display text-lg uppercase tracking-wide text-ink">
                {t('competitionsShowcase.mock.title')}
              </p>

              <div className="mt-4 rounded-lg border border-line bg-kuro p-3">
                <div className="flex items-center gap-2">
                  <p className="font-display uppercase tracking-wide text-ink">
                    {t('competitionsShowcase.mock.eventName')}
                  </p>
                  <span>🥇</span>
                </div>
                <p className="text-xs text-muted">{t('competitionsShowcase.mock.eventDate')}</p>
                <p className="mt-1 text-sm text-aka-text">{t('competitionsShowcase.mock.placement')}</p>
              </div>

              <div className="mt-3 rounded-lg border border-line bg-kuro p-3">
                <div className="flex items-center gap-2">
                  <p className="font-display uppercase tracking-wide text-ink">
                    {t('competitionsShowcase.mock.eventName2')}
                  </p>
                  <span>🥉</span>
                </div>
                <p className="text-xs text-muted">{t('competitionsShowcase.mock.eventDate2')}</p>
              </div>

              <div className="mt-8 flex justify-between border-t border-line pt-3 text-[9px] uppercase tracking-wide text-muted">
                <span>{t('tabs.home')}</span>
                <span>{t('tabs.schedule')}</span>
                <span className="text-aka-text">{t('tabs.competitions')}</span>
                <span>{t('tabs.payments')}</span>
                <span>{t('tabs.profile')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            {t('competitionsShowcase.title')}
          </h2>
          <div className="mt-4 h-px w-12 bg-gold" />
          <p className="mt-6 leading-relaxed text-muted">{t('competitionsShowcase.body')}</p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aka" />
                <span className="text-sm text-muted">{t(`competitionsShowcase.points.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
