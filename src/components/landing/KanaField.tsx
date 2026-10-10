import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Real dojo vocabulary, not decorative gibberish: karate, way/do, spirit,
// power, kata, respect, dojo, technique, hard/soft (goju).
const CHARACTERS = ['空', '手', '道', '気', '心', '力', '型', '礼', '場', '技', '柔', '剛']
const COLS = 14
const ROWS = 8
const GRID = Array.from({ length: COLS * ROWS }, (_, i) => CHARACTERS[i % CHARACTERS.length])

export function KanaField({ burst = false }: { burst?: boolean }) {
  const reducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <motion.div
      style={reducedMotion ? undefined : { opacity }}
      className={`pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] ${burst ? 'kana-field-burst' : ''}`}
      aria-hidden="true"
    >
      <div
        className="grid h-full w-full place-items-center"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {GRID.map((ch, i) => (
          <span key={i} className={`kana-char kana-char-${i % 10} font-display text-lg`}>
            {ch}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
