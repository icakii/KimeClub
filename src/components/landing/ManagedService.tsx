import { useTranslation } from 'react-i18next'
import { Reveal, SectionHeading } from './Section'

const POINTS = [
  { key: 'noAdmin', kanji: '楽', accent: 'text-kin' },
  { key: 'humanSupport', kanji: '人', accent: 'text-sakura' },
  { key: 'growWithYou', kanji: '伸', accent: 'text-jade' },
] as const

// Full-bleed indigo band: the page's one big break from paper and ink.
export function ManagedService() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-ai px-6 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(194,54,31,0.35), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-[50vmin] w-[50vmin] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,151,63,0.25), transparent 70%)' }}
      />
      <span
        className="pointer-events-none absolute -bottom-16 right-6 font-brush text-[18rem] leading-none text-shiro/5"
        aria-hidden="true"
      >
        礼
      </span>

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading kanji="礼" title={t('managed.title')} tone="aka" inverted />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-shiro/75">
            {t('managed.body')}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.key} delay={0.2 + i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-shiro/10 bg-shiro/5 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:bg-shiro/10">
                <span className={`font-brush text-4xl leading-none ${p.accent}`} aria-hidden="true">
                  {p.kanji}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-wider text-shiro">
                  {t(`managed.points.${p.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-shiro/70">
                  {t(`managed.points.${p.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
