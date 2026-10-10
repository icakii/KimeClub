import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

// Page title with a stamped kanji badge -- the app's version of the landing
// page's SectionHeading, sized for a phone.
export function PageHeader({
  kanji,
  title,
  tone = 'bg-aka',
  children,
}: {
  kanji: string
  title: string
  tone?: string
  children?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ opacity: 0, scale: 1.7, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.05 }}
          className={`${tone} rounded-sm px-1.5 py-1 font-brush text-lg leading-none text-shiro shadow-md`}
          aria-hidden="true"
        >
          {kanji}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="font-display text-2xl font-bold uppercase tracking-wide text-ink"
        >
          {title}
        </motion.h1>
      </div>
      {children}
    </div>
  )
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Children wrapped in <StaggerItem> cascade in one after another.
export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={listVariants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

// The default content surface: near-opaque paper card (no backdrop blur --
// it repaints every frame over the animated kanji backdrop).
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-shiro/95 p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)] ${className}`}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-muted ${className}`}>
      {children}
    </p>
  )
}

// Japanese weekday kanji, Monday-first to match classes.weekday (0 = Mon).
export const DAY_KANJI = ['月', '火', '水', '木', '金', '土', '日']
