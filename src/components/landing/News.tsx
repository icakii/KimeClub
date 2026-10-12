import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Reveal, SectionHeading } from './Section'

// Club news. Example posts for now; a real club's posts come from the
// announcements it sends.
const POSTS = [
  { key: 'grading', kanji: '帯', tone: 'bg-jade', date: '2026-11-15' },
  { key: 'medals', kanji: '勝', tone: 'bg-kin', date: '2026-10-05' },
  { key: 'kids', kanji: '子', tone: 'bg-aka', date: '2026-09-20' },
] as const

export function News() {
  const { t, i18n } = useTranslation()

  return (
    <section id="news" className="scroll-mt-20 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="報" title={t('news.title')} tone="kin" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 shadow-[0_20px_40px_-28px_rgba(31,27,22,0.5)]"
              >
                {/* Placeholder cover until the club adds a photo. */}
                <div className={`relative flex aspect-[16/9] items-center justify-center ${p.tone}`}>
                  <span className="font-brush text-7xl text-shiro/90 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    {p.kanji}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-ink/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-shiro">
                    {t('news.placeholder')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {new Date(`${p.date}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold uppercase tracking-wide text-ink">
                    {t(`news.posts.${p.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{t(`news.posts.${p.key}.body`)}</p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
