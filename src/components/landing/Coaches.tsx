import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { CoachBio } from '../../hooks/useClub'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Reveal, SectionHeading } from './Section'

const TONES = ['from-ai to-ink', 'from-aka to-ink', 'from-jade to-ink', 'from-gold to-ink']

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Large portrait cards: the photo fills the top of the card (or a painted
// placeholder with initials until the club sends one), name over it.
export function Coaches({ coaches }: { coaches: CoachBio[] | undefined }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.resolvedLanguage === 'en'
  const reduced = useReducedMotion()

  if (!coaches || coaches.length === 0) return null

  return (
    <section id="coaches" className="scroll-mt-20 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kanji="師範" title={t('coaches.title')} tone="ai" />
        <div className="mx-auto mt-14 grid max-w-xs gap-6 sm:max-w-none sm:grid-cols-2">
          {coaches.map((coach, i) => (
            <Reveal key={coach.name} delay={i * 0.12}>
              <motion.article
                whileHover={reduced ? undefined : { y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="group h-full overflow-hidden rounded-3xl border border-ink/10 bg-shiro/95 shadow-[0_30px_60px_-36px_rgba(31,27,22,0.7)]"
              >
                <div className="relative aspect-square overflow-hidden sm:aspect-4/5">
                  {coach.photo_url ? (
                    <img
                      src={coach.photo_url}
                      alt={coach.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${TONES[i % TONES.length]}`}>
                      <span className="font-display text-6xl font-bold tracking-wider text-shiro/90">
                        {initials(coach.name)}
                      </span>
                      <span
                        className="pointer-events-none absolute -bottom-6 -right-2 font-brush text-[8rem] leading-none text-shiro/10"
                        aria-hidden="true"
                      >
                        師
                      </span>
                    </div>
                  )}
                  {/* Name over a dark fade at the foot of the portrait. */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/50 to-transparent px-5 pb-4 pt-14">
                    <p className="font-display text-xl font-bold uppercase tracking-wide text-shiro">{coach.name}</p>
                    <span className="mt-2 inline-block rounded-full bg-aka px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-shiro">
                      {isEn ? coach.title_en : coach.title_bg}
                    </span>
                  </div>
                </div>
                <p className="p-5 text-sm leading-relaxed text-muted">{isEn ? coach.bio_en : coach.bio_bg}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
