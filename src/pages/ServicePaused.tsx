import { useTranslation } from 'react-i18next'

export function ServicePaused() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-2xl uppercase tracking-wide">{t('suspended.title')}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{t('suspended.body')}</p>
      </div>
    </div>
  )
}
