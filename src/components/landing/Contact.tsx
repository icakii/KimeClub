import { useTranslation } from 'react-i18next'

const ADDRESS_QUERY = 'Mall Bulgaria, bul. Todor Kableshkov, Sofia, Bulgaria'
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&output=embed`
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            {t('contact.title')}
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-gold" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="pin-badge inline-flex items-center gap-2 rounded-full border border-gold/50 bg-surface px-4 py-1.5">
              <span>📍</span>
              <span className="font-display text-xs uppercase tracking-wide text-ink">Sofia</span>
            </div>

            <div className="mt-5 space-y-2 text-muted">
              <p>{t('contact.address')}</p>
              <p>{t('contact.phone')}</p>
              <p>{t('contact.email')}</p>
            </div>

            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-md border border-line px-5 py-2.5 font-display text-sm uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text"
            >
              {t('contact.viewOnMaps')}
            </a>
          </div>

          <div className="overflow-hidden rounded-lg border border-line shadow-sm">
            <iframe
              title="Kime Karate Club location"
              src={MAP_EMBED_SRC}
              className="h-72 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
