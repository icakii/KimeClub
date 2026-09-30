import { useTranslation } from 'react-i18next'
import type { CoachBio } from '../../hooks/useClub'

export function Coaches({ coaches }: { coaches: CoachBio[] | undefined }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.resolvedLanguage === 'en'

  if (!coaches || coaches.length === 0) return null

  return (
    <section id="coaches" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('coaches.title')}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {coaches.map((coach) => (
            <div key={coach.name} className="rounded-lg border border-line bg-surface p-6">
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
          ))}
        </div>
      </div>
    </section>
  )
}
