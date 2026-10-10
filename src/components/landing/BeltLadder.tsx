import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useBelts } from '../../hooks/useBelts'
import { BeltChip } from '../BeltChip'
import { SectionHeading } from './Section'

export function BeltLadder({ clubId }: { clubId: string | undefined }) {
  const { t, i18n } = useTranslation()
  const { data: belts } = useBelts(clubId)

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="帯" title={t('beltLadder.title')} tone="jade" />

        {/* Dark ink panel so the belt colors actually read -- white and
            yellow belts disappear on the paper background. */}
        <div className="relative mt-14 overflow-hidden rounded-3xl bg-ink px-6 py-12 shadow-[0_40px_80px_-40px_rgba(31,27,22,0.8)] sm:px-10">
          <span
            className="pointer-events-none absolute -bottom-16 -left-4 font-brush text-[14rem] leading-none text-shiro/5"
            aria-hidden="true"
          >
            帯
          </span>

          <div className="relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-4 right-4 top-8 hidden h-0.5 origin-left bg-linear-to-r from-shiro/60 via-kin to-aka sm:block"
            />
            <div className="relative flex flex-wrap justify-center gap-x-6 gap-y-8 sm:flex-nowrap sm:justify-between sm:gap-x-0">
              {belts?.map((belt, i) => (
                <motion.div
                  key={belt.id}
                  initial={{ opacity: 0, y: -24, rotate: -8 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.3 + i * 0.1 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Light disc behind each belt so white and black belts
                      both stay visible on the ink panel. */}
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-shiro/90 shadow-[0_0_0_6px_rgba(251,246,234,0.08)]">
                    <BeltChip belt={belt} showLabel={false} />
                  </span>
                  <span className="font-display text-[11px] uppercase tracking-[0.2em] text-shiro/80">
                    {i18n.resolvedLanguage === 'en' ? belt.name_en : belt.name_bg}
                  </span>
                  <span className="font-display text-xs text-kin/80">{belt.rank}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
