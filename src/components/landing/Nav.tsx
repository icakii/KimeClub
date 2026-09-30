import { useTranslation } from 'react-i18next'
import { Enso } from './Enso'

export function Nav() {
  const { t, i18n } = useTranslation()

  return (
    <header className="sticky top-0 z-10 border-b border-line/60 bg-kuro/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2">
          <Enso className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold uppercase tracking-[3px] text-shiro">
              Kime
            </span>
            <span className="font-display text-[10px] uppercase tracking-[2px] text-muted-2">
              Карате клуб
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 font-display text-sm uppercase tracking-wide text-muted sm:flex">
          <a href="#schedule" className="transition-colors hover:text-aka-text">
            {t('nav.schedule')}
          </a>
          <a href="#coaches" className="transition-colors hover:text-aka-text">
            {t('nav.coaches')}
          </a>
          <a href="#contact" className="transition-colors hover:text-aka-text">
            {t('nav.contact')}
          </a>
        </nav>

        <div className="flex items-center gap-1 font-display text-xs uppercase tracking-wide">
          <button
            type="button"
            onClick={() => i18n.changeLanguage('bg')}
            aria-pressed={i18n.resolvedLanguage === 'bg'}
            className={`rounded px-2 py-1 transition-colors ${
              i18n.resolvedLanguage === 'bg' ? 'text-aka-text' : 'text-muted hover:text-shiro'
            }`}
          >
            BG
          </button>
          <span className="text-line">|</span>
          <button
            type="button"
            onClick={() => i18n.changeLanguage('en')}
            aria-pressed={i18n.resolvedLanguage === 'en'}
            className={`rounded px-2 py-1 transition-colors ${
              i18n.resolvedLanguage === 'en' ? 'text-aka-text' : 'text-muted hover:text-shiro'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  )
}
