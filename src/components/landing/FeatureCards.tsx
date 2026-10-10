import { useTranslation } from 'react-i18next'
import { Reveal, SectionHeading } from './Section'

// Each feature owns one dye color and a kanji: apply 申, belt 帯, news 報,
// payment 払 -- so the four cards read as distinct, not four beige boxes.
const FEATURES = [
  { key: 'signup', kanji: '申', bar: 'bg-ai', text: 'text-ai', mark: 'text-ai' },
  { key: 'progress', kanji: '帯', bar: 'bg-jade', text: 'text-jade', mark: 'text-jade' },
  { key: 'news', kanji: '報', bar: 'bg-kin', text: 'text-gold', mark: 'text-kin' },
  { key: 'payments', kanji: '払', bar: 'bg-aka', text: 'text-aka-text', mark: 'text-aka' },
] as const

export function FeatureCards() {
  const { t } = useTranslation()

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="心" title={t('features.title')} tone="ai" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.key} delay={i * 0.1}>
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 p-7 shadow-[0_20px_40px_-28px_rgba(31,27,22,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-28px_rgba(31,27,22,0.55)] ${
                  f.key === 'payments' ? 'shimmer-card' : ''
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${f.bar}`} />
                <span
                  className={`pointer-events-none absolute -bottom-6 -right-3 font-brush text-[8.5rem] leading-none opacity-[0.09] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${f.mark}`}
                  aria-hidden="true"
                >
                  {f.kanji}
                </span>
                <span className={`font-display text-sm font-semibold tracking-[0.3em] ${f.text}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-wide text-ink">
                  {t(`features.${f.key}.title`)}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">
                  {t(`features.${f.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
