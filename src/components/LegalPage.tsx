import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface LegalSection {
  title: string
  body: string[]
}

export function LegalPage({ namespace }: { namespace: 'privacy' | 'terms' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sections = t(`${namespace}.sections`, { returnObjects: true }) as LegalSection[]

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl uppercase tracking-wide">{t(`${namespace}.title`)}</h1>
      <p className="mt-2 text-xs uppercase tracking-wide text-muted-2">
        {t(`${namespace}.lastUpdated`)}
      </p>
      <p className="mt-6 leading-relaxed text-muted">{t(`${namespace}.intro`)}</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-sm uppercase tracking-wide text-ink">
              {section.title}
            </h2>
            <div className="mt-2 space-y-2">
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-10 inline-block text-sm text-aka-text hover:underline"
      >
        ← {t(`${namespace}.back`)}
      </button>
    </div>
  )
}
