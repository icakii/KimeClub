import { useTranslation } from 'react-i18next'
import { BeltChip } from '../BeltChip'
import { PaymentStatusChip } from '../PaymentStatusChip'

const EXAMPLE_BELT = {
  id: 'example',
  rank: 3,
  name_bg: 'Зелено',
  name_en: 'Green',
  color_hex: '#2e9e5b',
}

const POINTS = ['belt', 'payments', 'calendar', 'offline'] as const

export function AppShowcase() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            {t('appShowcase.title')}
          </h2>
          <div className="mt-4 h-px w-12 bg-gold" />
          <p className="mt-6 leading-relaxed text-muted">{t('appShowcase.body')}</p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aka" />
                <span className="text-sm text-muted">{t(`appShowcase.points.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <div className="rounded-[2.5rem] border-[10px] border-ink bg-ink p-2 shadow-xl">
            <div className="rounded-[1.75rem] bg-surface p-5">
              <p className="font-display text-lg uppercase tracking-wide text-ink">
                {t('appShowcase.mock.greeting')}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <BeltChip belt={EXAMPLE_BELT} showLabel={false} />
                <PaymentStatusChip status="paid" />
              </div>

              <div className="mt-6 rounded-lg border border-line bg-kuro p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  {t('appShowcase.mock.nextClass')}
                </p>
                <p className="mt-1 font-display uppercase tracking-wide text-ink">
                  {t('appShowcase.mock.className')}
                </p>
                <p className="text-xs text-muted">{t('appShowcase.mock.classTime')}</p>
              </div>

              <div className="mt-8 flex justify-between border-t border-line pt-3 text-[9px] uppercase tracking-wide text-muted">
                <span className="text-aka-text">{t('tabs.home')}</span>
                <span>{t('tabs.schedule')}</span>
                <span>{t('tabs.payments')}</span>
                <span>{t('tabs.profile')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
