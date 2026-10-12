import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MemberAvatar } from '../admin/MemberAvatar'
import { useAuth } from '../../hooks/useAuth'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { Emblem } from './Emblem'

// Signed in: the "Вход" button becomes the member's own photo/initials and
// leads back into the app.
function AccountButton() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)

  if (session && member) {
    return (
      <Link to="/app" aria-label={t('tabs.profile')} className="ml-2 rounded-full ring-2 ring-aka/60 transition-transform hover:scale-105">
        <MemberAvatar name={member.full_name} photoPath={member.photo_path} className="h-10 w-10 text-xs" />
      </Link>
    )
  }
  return (
    <Link
      to="/login"
      className="ml-2 min-h-10 rounded-md border border-line px-3 py-2 normal-case tracking-normal text-ink transition-colors hover:border-aka-text hover:text-aka-text"
    >
      {t('auth.navLink')}
    </Link>
  )
}

export function Nav() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#schedule', label: t('nav.schedule') },
    { href: '#news', label: t('nav.news') },
    { href: '#coaches', label: t('nav.coaches') },
    { href: '#contact', label: t('nav.contact') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-kuro/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <Emblem className="h-10 w-10" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold uppercase tracking-[3px] text-ink">Kime</span>
            <span className="font-display text-[10px] uppercase tracking-[2px] text-muted-2">Карате клуб</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 font-display text-sm uppercase tracking-wide text-muted md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-aka-text">
              {l.label}
            </a>
          ))}
          <Link to="/store" className="transition-colors hover:text-aka-text">
            {t('store.navLink')}
          </Link>
        </nav>

        <div className="flex items-center gap-1 font-display text-xs uppercase tracking-wide">
          {(['bg', 'en'] as const).map((lang, i) => (
            <span key={lang} className="flex items-center">
              {i > 0 && <span className="text-line">|</span>}
              <button
                type="button"
                onClick={() => i18n.changeLanguage(lang)}
                aria-pressed={i18n.resolvedLanguage === lang}
                className={`rounded px-2 py-1 transition-colors ${
                  i18n.resolvedLanguage === lang ? 'text-aka-text' : 'text-muted hover:text-ink'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            </span>
          ))}
          <AccountButton />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="relative ml-2 flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
          >
            <motion.span animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} className="absolute h-0.5 w-4 rounded bg-ink" />
            <motion.span animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} className="absolute h-0.5 w-4 rounded bg-ink" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line/60 md:hidden"
          >
            <div className="flex flex-col px-5 py-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    // Collapse first, then scroll, or the shrinking menu throws the jump off.
                    e.preventDefault()
                    setOpen(false)
                    window.setTimeout(() => document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' }), 320)
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.04 }}
                  className="border-b border-line/50 py-3.5 font-display text-sm uppercase tracking-wide text-ink"
                >
                  {l.label}
                </motion.a>
              ))}
              <Link to="/store" className="py-3.5 font-display text-sm uppercase tracking-wide text-aka-text">
                {t('store.navLink')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
