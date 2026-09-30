import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer({ clubName }: { clubName: string }) {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-2 sm:flex-row">
        <p>
          {clubName} · {t('footer.rights')}
        </p>
        <Link to="/privacy" className="transition-colors hover:text-aka-text">
          {t('footer.privacy')}
        </Link>
      </div>
    </footer>
  )
}
