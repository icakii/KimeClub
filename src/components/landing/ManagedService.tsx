import { useTranslation } from 'react-i18next'

const POINTS = ['noAdmin', 'humanSupport', 'growWithYou'] as const

export function ManagedService() {
  const { t } = useTranslation()

  return (
    <section className="bg-surface px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
          {t('managed.title')}
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-gold" />
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">{t('managed.body')}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {POINTS.map((key) => (
            <div key={key} className="rounded-lg border border-ink/20 bg-kuro p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                {t(`managed.points.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`managed.points.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
