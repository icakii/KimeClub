import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

const GLOWS = {
  aka: 'radial-gradient(closest-side, rgba(194,54,31,0.32), rgba(233,168,160,0.16) 55%, transparent)',
  ai: 'radial-gradient(closest-side, rgba(47,79,122,0.32), rgba(31,51,82,0.12) 55%, transparent)',
  jade: 'radial-gradient(closest-side, rgba(47,107,79,0.3), rgba(201,151,63,0.14) 55%, transparent)',
}

// Shared phone mockup for the app showcases: real phone proportions, a
// colored glow behind it, a slow idle float, and a scroll-driven tilt so the
// device rotates into place as its section passes through the viewport.
export function PhoneFrame({
  children,
  glow = 'aka',
  tilt = 1,
}: {
  children: ReactNode
  glow?: keyof typeof GLOWS
  tilt?: 1 | -1
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scrollYProgress = useSpring(rawProgress, { stiffness: 100, damping: 26, mass: 0.5 })
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [tilt * 8, 0, tilt * -6])
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[290px]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[170%] -translate-x-1/2 -translate-y-1/2"
        style={{ background: GLOWS[glow] }}
      />
      <motion.div style={{ rotate, y }} className="relative will-change-transform">
        <div className="float-y">
          <div className="relative aspect-[9/18.5] rounded-[2.6rem] border-[9px] border-ink bg-ink p-1 shadow-[0_40px_80px_-30px_rgba(31,27,22,0.55)]">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Bottom tab bar inside the mockups, mirroring the real app's nav.
export function PhoneTabs({ tabs, active }: { tabs: string[]; active: number }) {
  return (
    <div className="mt-auto flex justify-between border-t border-line bg-shiro/70 px-4 py-3 text-[9px] uppercase tracking-wide text-muted">
      {tabs.map((tab, i) => (
        <span key={tab} className={i === active ? 'font-semibold text-aka-text' : undefined}>
          {tab}
        </span>
      ))}
    </div>
  )
}
