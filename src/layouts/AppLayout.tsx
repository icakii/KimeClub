import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import { OfflineBanner } from '../components/OfflineBanner'

const TABS = [
  { to: '/app', end: true, key: 'home' },
  { to: '/app/schedule', end: false, key: 'schedule' },
  { to: '/app/payments', end: false, key: 'payments' },
  { to: '/app/profile', end: false, key: 'profile' },
] as const

export function AppLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col pb-16">
      <OfflineBanner />
      <main className="flex-1">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-surface">
        {TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 font-display text-[11px] uppercase tracking-wide transition-colors ${
                isActive ? 'text-aka-text' : 'text-muted'
              }`
            }
          >
            {t(`tabs.${tab.key}`)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
