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
        <h2 className="text-center font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {t('coaches.title')}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="flex gap-5 rounded-lg border border-line bg-surface p-6 sm:p-8"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-aka-text/40 font-display text-lg text-aka-text">
                {initials(coach.name)}
              </span>
              <div>
                <p className="font-display text-lg uppercase tracking-wide text-shiro">
                  {coach.name}
                </p>
                <p className="mt-1 text-sm uppercase tracking-wide text-aka-text">
                  {isEn ? coach.title_en : coach.title_bg}
                </p>
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
