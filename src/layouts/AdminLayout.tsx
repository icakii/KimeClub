import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LegalLinks } from '../components/LegalLinks'
import { useAuth } from '../hooks/useAuth'
import { useClub } from '../hooks/useClub'
import { useMember } from '../hooks/useMember'

export function AdminLayout() {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const navigate = useNavigate()

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `pb-2 ${isActive ? 'border-b-2 border-aka text-ink' : 'text-muted'}`

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
          <button
            type="button"
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
            className="text-aka-text"
          >
            {t('profilePage.logout')}
          </button>
        </div>
      </header>
      <nav className="flex gap-4 border-b border-line px-6 font-display text-xs uppercase tracking-wide">
        <NavLink to="/admin" end className={tabClass}>
          {t('admin.nav.members')}
        </NavLink>
        <NavLink to="/admin/attendance" className={tabClass}>
          {t('admin.nav.attendance')}
        </NavLink>
        <NavLink to="/admin/payments" className={tabClass}>
          {t('admin.nav.payments')}
        </NavLink>
        {member?.role === 'owner' && (
          <NavLink to="/admin/subscription" className={tabClass}>
            {t('admin.nav.subscription')}
          </NavLink>
        )}
      </nav>
      <Outlet />
      <LegalLinks className="py-8" />
    </div>
  )
}
