import { useTranslation } from 'react-i18next'

const FEATURES = ['signup', 'progress', 'news'] as const

export function FeatureCards() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
          {t('features.title')}
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-gold" />
        <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {FEATURES.map((key, index) => (
            <div
              key={key}
              className="rounded-lg border border-ink/20 bg-surface p-6 transition-colors hover:border-aka-text sm:p-8"
            >
              <span className="font-display text-4xl font-semibold text-aka-text/25">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-ink">
                {t(`features.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`features.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
