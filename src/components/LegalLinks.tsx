import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function LegalLinks({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={`flex justify-center gap-4 text-xs text-muted-2 ${className}`}>
      <Link to="/privacy" className="hover:text-aka-text">
        {t('footer.privacy')}
      </Link>
      <Link to="/terms" className="hover:text-aka-text">
        {t('footer.terms')}
      </Link>
    </div>
  )
}
