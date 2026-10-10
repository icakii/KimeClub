import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Enso } from './Enso'

// Hero-only intro: two clouds start centered over the headline (fully
// covering it, via the cloud-part-* keyframes in index.css), then part to
// reveal it and settle at a half-cleared resting opacity -- never fully
// gone unless you scroll the hero out of view, which this component also
// handles by fading the whole layer out with scroll (and back in on the
// way up), independent of the sitewide KanaField underneath it.
export function CloudReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <Enso className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-60 sm:h-64 sm:w-64" />
      <div className="cloud-left absolute left-1/2 top-1/2 h-[150%] w-[75%] rounded-[45%] bg-shiro/95 blur-3xl" />
      <div className="cloud-right absolute left-1/2 top-1/2 h-[150%] w-[75%] rounded-[45%] bg-shiro/95 blur-3xl" />
    </motion.div>
  )
}
