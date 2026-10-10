import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SectionHeading } from './Section'

const EASE = [0.22, 1, 0.36, 1] as const

// Drop real photos at public/gallery/dojo-1.jpg and dojo-2.jpg; until then
// each frame shows a painted placeholder instead of a broken image.
const PHOTOS = [
  { src: '/gallery/dojo-1.jpg', key: 'one', kanji: '稽古', tilt: -3, from: -80, tone: 'from-ai to-ink' },
  { src: '/gallery/dojo-2.jpg', key: 'two', kanji: '礼', tilt: 2.5, from: 80, tone: 'from-aka to-ink' },
] as const

function Frame({
  photo,
  index,
  drift,
}: {
  photo: (typeof PHOTOS)[number]
  index: number
  drift: MotionValue<number>
}) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, x: photo.from, rotate: photo.tilt * 3 }}
      whileInView={{ opacity: 1, x: 0, rotate: photo.tilt }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.1, ease: EASE, delay: index * 0.15 }}
      whileHover={reduced ? undefined : { rotate: 0, y: -8, transition: { duration: 0.4, ease: EASE } }}
      style={{ y: drift }}
      className={`group relative self-start ${index === 1 ? 'md:mt-24' : ''}`}
    >
      {/* Washi tape holding the print to the wall. */}
      <span
        className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rotate-[-4deg] bg-kin/60 shadow-sm"
        style={{ clipPath: 'polygon(3% 0, 97% 4%, 100% 100%, 0 94%)' }}
        aria-hidden="true"
      />
      <div className="relative rounded-sm bg-shiro p-3 pb-14 shadow-[0_30px_60px_-30px_rgba(31,27,22,0.65)] ring-1 ring-ink/10 sm:p-4 sm:pb-16">
        <div className="relative aspect-4/3 overflow-hidden bg-ink">
          {!failed ? (
            <img
              src={photo.src}
              alt={t(`gallery.${photo.key}.alt`)}
              loading="lazy"
              onError={() => setFailed(true)}
              className="h-full w-full scale-105 object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${photo.tone}`}>
              <span className="font-brush text-7xl text-shiro/85 sm:text-8xl">{photo.kanji}</span>
              <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-shiro/50">
                {t('gallery.placeholder')}
              </span>
            </div>
          )}
          {/* Inner keyline, like a mat cut. */}
          <span className="pointer-events-none absolute inset-2 border border-shiro/25" aria-hidden="true" />
        </div>
        <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-5">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-ink">
            {t(`gallery.${photo.key}.caption`)}
          </span>
          <motion.span
            initial={reduced ? false : { scale: 2.2, opacity: 0, rotate: -30 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.7 + index * 0.15 }}
            className="rounded-sm bg-aka px-1.5 py-1 font-brush text-sm leading-none text-shiro"
            aria-hidden="true"
          >
            極
          </motion.span>
        </figcaption>
      </div>
    </motion.figure>
  )
}

export function Gallery() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })
  // The two prints drift at different speeds, so the pair feels layered.
  const driftA = useTransform(smooth, [0, 1], [40, -40])
  const driftB = useTransform(smooth, [0, 1], [90, -90])

  return (
    <section ref={ref} id="gallery" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading kanji="写" title={t('gallery.title')} tone="kin" />
        <p className="mx-auto mt-5 max-w-xl text-center text-muted">{t('gallery.subtitle')}</p>
        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10">
          <Frame photo={PHOTOS[0]} index={0} drift={driftA} />
          <Frame photo={PHOTOS[1]} index={1} drift={driftB} />
        </div>
      </div>
    </section>
  )
}
