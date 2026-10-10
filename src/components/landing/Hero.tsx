import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Emblem } from './Emblem'

const WORDMARK = ['K', 'I', 'M', 'E']

// A traditional kumo (Japanese cloud) band: overlapping lobes on a flat
// base. Drawn twice -- a thick gold stroke underneath, the cream fill on
// top -- so only the outer silhouette gets an outline, like a woodblock
// print, instead of every overlapping circle showing its own edge.
const LOBES: [number, number, number][] = [
  [60, 150, 58],
  [150, 118, 74],
  [255, 130, 66],
  [352, 100, 84],
  [458, 124, 70],
  [552, 142, 62],
  [612, 166, 46],
]

function Kumo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 660 230" className={className} aria-hidden="true">
      <g stroke="var(--color-kin)" strokeWidth="7" fill="var(--color-kin)" opacity="0.55">
        {LOBES.map(([cx, cy, r]) => (
          <circle key={`o${cx}`} cx={cx} cy={cy} r={r} />
        ))}
        <rect x="-60" y="150" width="700" height="80" rx="40" />
      </g>
      <g fill="var(--color-shiro)">
        {LOBES.map(([cx, cy, r]) => (
          <circle key={`f${cx}`} cx={cx} cy={cy} r={r} />
        ))}
        <rect x="-60" y="150" width="700" height="80" rx="40" />
      </g>
      <g fill="none" stroke="var(--color-kin)" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <path d="M120 140 q 28 -34 62 -8" />
        <path d="M318 118 q 34 -40 74 -6" />
        <path d="M498 140 q 24 -28 54 -6" />
      </g>
    </svg>
  )
}

function CloudBank({
  side,
  progress,
}: {
  side: 'left' | 'right'
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const reducedMotion = useReducedMotion()
  const sign = side === 'left' ? -1 : 1
  // Scroll pushes the already-parted bank further off and fades it, so
  // leaving the hero clears the clouds and coming back brings them in.
  const scrollX = useTransform(progress, [0, 1], ['0%', `${sign * 45}%`])
  const scrollOpacity = useTransform(progress, [0, 0.7], [1, 0])
  // Half-cleared: each bank keeps roughly its outer fifth of the hero.
  const rest = `${sign * 70}%`

  return (
    <motion.div
      style={{ x: scrollX, opacity: scrollOpacity }}
      className={`pointer-events-none absolute inset-y-0 z-20 w-[80%] will-change-transform ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <motion.div
        initial={{ x: reducedMotion ? rest : '0%' }}
        animate={{ x: rest }}
        transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="h-full w-full"
      >
        {/* Mirror on a child, not the animated element: a `scale` on the
            same element flips the axis framer-motion's translateX runs in,
            sending the right bank left across the page instead of out. */}
        <div className={`relative h-full w-full ${side === 'right' ? '-scale-x-100' : ''}`}>
          <Kumo className="absolute left-[-10%] top-[-4%] w-full" />
          <Kumo className="absolute left-0 top-[30%] w-full" />
          <Kumo className="absolute left-[-15%] top-[63%] w-full" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Spring-smoothed so parallax eases instead of tracking scroll jitter 1:1.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-6 pb-12 pt-8 sm:py-20"
    >
      {/* Color: a vermilion rising sun behind the mark, with indigo and jade
          washes at the corners so the page isn't a single beige/red note. */}
      <motion.div style={{ scale: sunScale }} className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="sun-breathe absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(194,54,31,0.30) 0%, rgba(233,168,160,0.22) 38%, rgba(201,151,63,0.10) 58%, transparent 72%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-[60vmin] w-[60vmin] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(31,51,82,0.16), transparent 70%)' }}
        />
        <div
          className="absolute -right-32 -top-32 h-[50vmin] w-[50vmin] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(47,107,79,0.14), transparent 70%)' }}
        />
      </motion.div>

      {/* Mist: washes the whole hero out at first so nothing shows through
          the gaps between cloud lobes, then thins as the clouds part. */}
      {!reducedMotion && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.3, delay: 0.35, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-10 bg-shiro"
        />
      )}

      <CloudBank side="left" progress={scrollYProgress} />
      <CloudBank side="right" progress={scrollYProgress} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-30 flex flex-col items-center text-center"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="relative">
            <Emblem animated className="h-28 w-28 sm:h-48 sm:w-48 lg:h-56 lg:w-56" />
            <span
              className="stamp-in absolute -bottom-1 -right-3 flex flex-col items-center rounded-[3px] bg-aka px-1.5 py-1 font-brush text-sm leading-[1.05] text-shiro shadow-md sm:text-base"
              style={{ animationDelay: '1.9s' }}
              aria-hidden="true"
            >
              <span>道</span>
              <span>場</span>
            </span>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h1
              className="flex font-display text-[4.6rem] font-bold uppercase leading-[0.82] tracking-[0.06em] text-ink sm:text-[8rem] lg:text-[10.5rem]"
              aria-label="Kime Karate Club"
            >
              {WORDMARK.map((letter, i) => (
                <span key={i} className="overflow-hidden pb-1">
                  <span className="letter-rise" style={{ animationDelay: `${1.05 + i * 0.09}s` }}>
                    {letter}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="reveal-up mt-3 flex items-center gap-3 font-display text-lg font-semibold uppercase tracking-[0.45em] text-aka-text sm:text-2xl lg:text-[1.7rem]"
              style={{ animationDelay: '1.5s' }}
            >
              <span className="h-px w-8 bg-aka-text/60" />
              {t('hero.subtitle')}
              <span className="h-px w-8 bg-aka-text/60 lg:hidden" />
            </p>
          </div>
        </div>

        <p
          className="reveal-up mt-6 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-10 sm:text-lg"
          style={{ animationDelay: '1.75s' }}
        >
          {t('hero.tagline')}
        </p>

        <div
          className="reveal-up mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8"
          style={{ animationDelay: '1.95s' }}
        >
          <a
            href="#contact"
            className="group relative min-h-11 overflow-hidden rounded-md bg-aka px-5 py-3 sm:px-7 font-display text-sm uppercase tracking-wide text-shiro shadow-[0_10px_30px_-10px_rgba(194,54,31,0.7)] transition-transform hover:-translate-y-0.5"
          >
            <span className="relative z-10">{t('hero.ctaTrial')}</span>
            <span className="absolute inset-0 -translate-x-full bg-ai transition-transform duration-500 group-hover:translate-x-0" />
          </a>
          <a
            href="#schedule"
            className="min-h-11 rounded-md border border-ink/25 bg-shiro/90 px-5 py-3 sm:px-7 font-display text-sm uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text"
          >
            {t('hero.ctaSchedule')}
          </a>
        </div>
      </motion.div>

      <div
        className="fade-in absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 sm:flex flex-col items-center gap-2"
        style={{ animationDelay: '2.4s' }}
        aria-hidden="true"
      >
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-muted">
          {t('hero.scroll')}
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-ink/15">
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-aka" />
        </span>
      </div>
    </section>
  )
}
