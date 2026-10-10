import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Emblem } from './Emblem'

export function Footer({ clubName }: { clubName: string }) {
  const { t } = useTranslation()

  return (
    <footer className="relative overflow-hidden bg-ink px-6 pb-10 pt-20 text-shiro">
      <span
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[11rem] font-bold uppercase leading-none tracking-widest text-shiro/4 sm:text-[18rem]"
        aria-hidden="true"
      >
        Kime
      </span>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <div className="rounded-full bg-shiro p-2">
          <Emblem className="h-16 w-16" />
        </div>
        <p className="font-display text-2xl font-semibold uppercase tracking-[0.3em]">{clubName}</p>
        <div className="flex gap-6 text-sm text-shiro/60">
          <a href="#schedule" className="hover:text-kin">
            {t('nav.schedule')}
          </a>
          <a href="#coaches" className="hover:text-kin">
            {t('nav.coaches')}
          </a>
          <a href="#contact" className="hover:text-kin">
            {t('nav.contact')}
          </a>
        </div>
        <div className="mt-6 flex w-full flex-col items-center justify-between gap-3 border-t border-shiro/10 pt-6 text-xs text-shiro/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {clubName} · {t('footer.rights')}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-kin">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-kin">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
