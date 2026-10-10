import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

// Fades/slides its children in the first time they scroll into view.
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Section title with a brush kanji badge and a hand-drawn underline that
// strokes itself in when the heading enters the viewport.
export function SectionHeading({
  kanji,
  title,
  align = 'center',
  tone = 'aka',
  inverted = false,
}: {
  kanji: string
  title: string
  align?: 'center' | 'left'
  tone?: 'aka' | 'ai' | 'jade' | 'kin'
  inverted?: boolean
}) {
  const toneBg = {
    aka: 'bg-aka',
    ai: 'bg-ai',
    jade: 'bg-jade',
    kin: 'bg-kin',
  }[tone]
  const centered = align === 'center'

  return (
    <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
      <motion.span
        initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className={`${toneBg} rounded-sm px-2 py-1 font-brush text-xl leading-none text-shiro shadow-md`}
        aria-hidden="true"
      >
        {kanji}
      </motion.span>
      <Reveal delay={0.1} y={18}>
        <h2
          className={`mt-5 font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl lg:text-5xl ${
            inverted ? 'text-shiro' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      <svg viewBox="0 0 120 12" className="mt-3 h-3 w-28" aria-hidden="true">
        <motion.path
          d="M3 8 C 25 3, 45 10, 62 6 S 100 3, 117 7"
          fill="none"
          stroke={inverted ? 'var(--color-kin)' : 'var(--color-aka)'}
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        />
      </svg>
    </div>
  )
}
