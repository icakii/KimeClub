import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Enso } from '../components/landing/Enso'

export function Store() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Enso className="h-20 w-20 opacity-70" />
      <h1 className="mt-4 font-display text-2xl uppercase tracking-wide">{t('store.title')}</h1>
      <p className="mt-3 max-w-sm text-muted">{t('store.body')}</p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-8 text-sm text-aka-text hover:underline"
      >
        ← {t('common.back')}
      </button>
    </div>
  )
}
