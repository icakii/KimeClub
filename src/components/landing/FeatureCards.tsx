import { useTranslation } from 'react-i18next'

const FEATURES = ['signup', 'progress', 'news'] as const

export function FeatureCards() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('features.title')}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((key) => (
            <div
              key={key}
              className="rounded-lg border border-line bg-surface p-6 transition-colors hover:border-aka-text/60"
            >
              <h3 className="font-display text-lg uppercase tracking-wide text-shiro">
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
