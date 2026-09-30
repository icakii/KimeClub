import { useTranslation } from 'react-i18next'

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-2xl uppercase tracking-wide">{t('contact.title')}</h2>
        <div className="mt-6 space-y-2 text-muted">
          <p>{t('contact.address')}</p>
          <p>{t('contact.phone')}</p>
          <p>{t('contact.email')}</p>
        </div>
      </div>
    </section>
  )
}
