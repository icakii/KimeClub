import { useTranslation } from 'react-i18next'
import type { CoachBio } from '../../hooks/useClub'

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
    <section id="coaches" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
          {t('coaches.title')}
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-gold" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="flex gap-5 rounded-lg border border-ink/20 bg-surface p-6 sm:p-8"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-lg text-gold">
                {initials(coach.name)}
              </span>
              <div>
                <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {coach.name}
                </p>
                <span className="mt-2 inline-block rounded-full border border-aka-text/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-aka-text">
                  {isEn ? coach.title_en : coach.title_bg}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {isEn ? coach.bio_en : coach.bio_bg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
