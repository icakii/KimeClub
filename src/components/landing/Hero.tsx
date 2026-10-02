import { useTranslation } from 'react-i18next'
import { Enso } from './Enso'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="text-center lg:max-w-xl lg:text-left">
          <h1 className="font-display text-4xl font-semibold uppercase leading-tight tracking-wide sm:text-6xl">
            <span className="reveal-up block" style={{ animationDelay: '0.05s' }}>
              {t('hero.line1')}
            </span>
            <span className="reveal-up block" style={{ animationDelay: '0.2s' }}>
              {t('hero.line2')}
            </span>
            <span className="reveal-up block text-aka-text" style={{ animationDelay: '0.35s' }}>
              {t('hero.line3')}
            </span>
          </h1>

          <div
            className="reveal-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            style={{ animationDelay: '0.5s' }}
          >
            <a
              href="#contact"
              className="min-h-11 rounded-md bg-aka px-6 py-3 font-display text-sm uppercase tracking-wide text-shiro transition-transform hover:scale-[1.03]"
            >
              {t('hero.ctaTrial')}
            </a>
            <a
              href="#schedule"
              className="min-h-11 rounded-md border border-line px-6 py-3 font-display text-sm uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text"
            >
              {t('hero.ctaSchedule')}
            </a>
          </div>
        </div>

        <Enso className="pointer-events-none h-56 w-56 shrink-0 sm:h-72 sm:w-72 lg:h-96 lg:w-96" />
      </div>
    </section>
  )
}
