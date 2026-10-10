import { useTranslation } from 'react-i18next'
import type { CoachBio } from '../../hooks/useClub'
import { Reveal, SectionHeading } from './Section'

const AVATAR_TONES = ['bg-ai', 'bg-aka', 'bg-jade', 'bg-gold']

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Coaches({ coaches }: { coaches: CoachBio[] | undefined }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.resolvedLanguage === 'en'

  if (!coaches || coaches.length === 0) return null

  return (
    <section id="coaches" className="scroll-mt-20 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="師範" title={t('coaches.title')} tone="ai" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {coaches.map((coach, i) => (
            <Reveal key={coach.name} delay={i * 0.12}>
              <div className="group relative flex h-full gap-6 overflow-hidden rounded-2xl border border-ink/10 bg-shiro/85 p-7 shadow-[0_20px_40px_-28px_rgba(31,27,22,0.5)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 sm:p-8">
                <span
                  className="pointer-events-none absolute -bottom-8 -right-2 font-brush text-[9rem] leading-none text-ink/5"
                  aria-hidden="true"
                >
                  師
                </span>
                <span
                  className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-xl font-semibold text-shiro shadow-md ring-4 ring-shiro transition-transform duration-500 group-hover:rotate-6 ${
                    AVATAR_TONES[i % AVATAR_TONES.length]
                  }`}
                >
                  {initials(coach.name)}
                </span>
                <div className="relative">
                  <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                    {coach.name}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-aka px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-shiro">
                    {isEn ? coach.title_en : coach.title_bg}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {isEn ? coach.bio_en : coach.bio_bg}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
