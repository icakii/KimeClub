import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Privacy() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl uppercase tracking-wide">{t('privacy.title')}</h1>
      <p className="mt-4 leading-relaxed text-muted">{t('privacy.body')}</p>
      <Link to="/" className="mt-8 text-sm text-aka-text hover:underline">
        ← {t('privacy.back')}
      </Link>
    </div>
  )
}
