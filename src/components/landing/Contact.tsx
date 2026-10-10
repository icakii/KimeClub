import { useTranslation } from 'react-i18next'
import { Reveal, SectionHeading } from './Section'

const ADDRESS_QUERY = 'Mall Bulgaria, bul. Todor Kableshkov, Sofia, Bulgaria'
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&output=embed`
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading kanji="連絡" title={t('contact.title')} tone="aka" />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="rounded-2xl border border-ink/10 bg-shiro/95 p-8 text-center shadow-[0_20px_40px_-28px_rgba(31,27,22,0.5)] lg:text-left">
            <div className="pin-badge inline-flex items-center gap-2 rounded-full border border-gold/50 bg-surface px-4 py-1.5">
              <span>📍</span>
              <span className="font-display text-xs uppercase tracking-wide text-ink">Sofia</span>
            </div>

            <div className="mt-6 space-y-3 text-ink/80">
              <p className="text-lg">{t('contact.address')}</p>
              <a href="tel:+359881234567" className="block font-display text-2xl font-semibold text-ink hover:text-aka-text">
                {t('contact.phone')}
              </a>
              <a href="mailto:info@kime.demo" className="block text-aka-text hover:underline">
                {t('contact.email')}
              </a>
            </div>

            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-md bg-ink px-6 py-3 font-display text-sm uppercase tracking-wide text-shiro transition-colors hover:bg-aka"
            >
              {t('contact.viewOnMaps')}
            </a>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="overflow-hidden rounded-2xl border-4 border-shiro shadow-[0_30px_60px_-30px_rgba(31,27,22,0.6)]">
              <iframe
                title="Kime Karate Club location"
                src={MAP_EMBED_SRC}
                className="h-80 w-full sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <span
              className="absolute -right-3 -top-3 rotate-6 rounded-sm bg-aka px-2 py-1 font-brush text-lg leading-none text-shiro shadow-md"
              aria-hidden="true"
            >
              道場
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
