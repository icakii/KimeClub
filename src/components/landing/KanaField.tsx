import { useEffect, useRef, useState } from 'react'

// Real dojo vocabulary, not decorative gibberish: karate, way/do, spirit,
// power, kata, respect, dojo, technique, soft/hard (goju), kime, practice.
const CHARACTERS = ['空', '手', '道', '気', '心', '力', '型', '礼', '場', '技', '柔', '剛', '極', '武']
const CELL = 38

// Cheap deterministic scatter so tones/beats don't line up in visible
// stripes (i % n would repeat in perfect columns on a fixed-width grid).
function hash(i: number): number {
  let x = (i + 1) * 2654435761
  x ^= x >>> 15
  return Math.abs(x)
}

export function KanaField() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return

    // Sized from the parent's real height (the whole landing page), and the
    // field itself is overflow-hidden -- so it can never push the page
    // taller and feed back into its own measurement.
    function measure() {
      if (!parent) return
      const cols = Math.ceil(parent.clientWidth / CELL)
      const rows = Math.ceil(parent.scrollHeight / CELL)
      setCount(cols * rows)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 grid select-none overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${CELL}px)`,
        gridAutoRows: `${CELL}px`,
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const h = hash(i)
        return (
          <span
            key={i}
            className={`kana-char kana-tone-${h % 4} kana-beat-${(h >> 3) % 60} flex items-center justify-center font-brush text-[17px]`}
          >
            {CHARACTERS[(h >> 7) % CHARACTERS.length]}
          </span>
        )
      })}
    </div>
  )
}
