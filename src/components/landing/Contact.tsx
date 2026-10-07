import { useTranslation } from 'react-i18next'

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">{t('contact.title')}</h2>
        <div className="mx-auto mt-4 h-px w-12 bg-gold" />
        <div className="mt-6 space-y-2 text-muted">
          <p>{t('contact.address')}</p>
          <p>{t('contact.phone')}</p>
          <p>{t('contact.email')}</p>
        </div>
      </div>
    </section>
  )
}
