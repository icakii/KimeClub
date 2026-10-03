import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'
import { LegalLinks } from '../components/LegalLinks'
import { useAuth } from '../hooks/useAuth'

export function AdminLayout() {
  const { t } = useTranslation()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <p className="font-display text-sm uppercase tracking-[3px] text-ink">
          {t('admin.title')}
        </p>
        <div className="flex items-center gap-4 font-display text-xs uppercase tracking-wide">
          <Link to="/app" className="text-muted hover:text-aka-text">
            {t('admin.backToApp')}
          </Link>
          <button type="button" onClick={() => signOut()} className="text-aka-text">
            {t('profilePage.logout')}
          </button>
        </div>
      </header>
      <Outlet />
      <LegalLinks className="py-8" />
    </div>
  )
}
