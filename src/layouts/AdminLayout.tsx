import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { KanjiBackdrop } from '../components/KanjiBackdrop'
import { Emblem } from '../components/landing/Emblem'
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
  const location = useLocation()
  const outlet = useOutlet()

  const tabs = [
    { to: '/admin', end: true, label: t('admin.nav.members') },
    { to: '/admin/attendance', end: false, label: t('admin.nav.attendance') },
    { to: '/admin/payments', end: false, label: t('admin.nav.payments') },
    ...(member?.role === 'owner'
      ? [{ to: '/admin/subscription', end: false, label: t('admin.nav.subscription') }]
      : []),
  ]

  return (
    <div className="relative flex min-h-screen flex-col">
      <KanjiBackdrop parallax={0.3} baseAlpha={0.06} />
      <div className="kana-vignette" />

      <header className="sticky top-0 z-20 border-b border-line/60 bg-kuro/95">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <Link to="/admin" className="flex min-w-0 items-center gap-2.5">
            <Emblem className="h-9 w-9 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-display text-base font-semibold uppercase tracking-[0.3em] text-ink">Kime</p>
              <p className="truncate text-[10px] uppercase tracking-[0.2em] text-muted">{t('admin.title')}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 font-display text-xs uppercase tracking-wide">
            {member && (
              <span className="hidden rounded-full bg-ai px-3 py-1 text-[11px] text-shiro sm:inline">
                {t(`admin.role.${member.role}`)}
              </span>
            )}
            <Link
              to="/app"
              className="rounded-full px-3 py-2 text-muted transition-colors hover:text-aka-text"
              aria-label={t('admin.backToApp')}
            >
              <span className="sm:hidden">←</span>
              <span className="hidden sm:inline">{t('admin.backToApp')}</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await signOut()
                navigate('/')
              }}
              className="rounded-full border border-aka/30 px-3 py-2 text-aka-text transition-colors hover:bg-aka hover:text-shiro"
            >
              {t('profilePage.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-5 pt-5">
        <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-ink/10 bg-shiro/95 p-1.5 shadow-[0_14px_30px_-22px_rgba(31,27,22,0.6)]">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className="relative shrink-0 sm:flex-1">
              {({ isActive }) => (
                <span
                  className={`relative flex min-h-10 items-center justify-center rounded-xl px-4 font-display text-xs uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-shiro' : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-tab-pill"
                      className="absolute inset-0 rounded-xl bg-aka shadow-[0_8px_18px_-8px_rgba(194,54,31,0.9)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <LegalLinks className="relative py-8" />
    </div>
  )
}
