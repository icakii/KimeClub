import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl uppercase tracking-[3px] text-shiro">
        Kime <span className="text-aka">Karate Club</span>
      </h1>
      <p className="max-w-md text-muted">{t('landing.scaffoldNotice')}</p>
      <div className="flex gap-2 font-display text-sm uppercase tracking-wide">
        <button
          type="button"
          onClick={() => i18n.changeLanguage('bg')}
          className="rounded px-3 py-1 hover:text-aka-text"
        >
          BG
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          className="rounded px-3 py-1 hover:text-aka-text"
        >
          EN
        </button>
      </div>
    </main>
  )
}

export default App
