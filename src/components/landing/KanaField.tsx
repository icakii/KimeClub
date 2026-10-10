import { useEffect, useRef, useState } from 'react'

// Real dojo vocabulary, not decorative gibberish: karate, way/do, spirit,
// power, kata, respect, dojo, technique, hard/soft (goju).
const CHARACTERS = ['空', '手', '道', '気', '心', '力', '型', '礼', '場', '技', '柔', '剛']
const CELL_SIZE = 56

export function KanaField() {
  const containerRef = useRef<HTMLDivElement>(null)
  // Sized dynamically from the real document height -- a fixed guess runs
  // out of rows partway down any page taller than that guess, which is
  // exactly the bug this replaced (the field visibly stopping mid-page).
  const [cellCount, setCellCount] = useState(0)

  useEffect(() => {
    function measure() {
      const width = window.innerWidth
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      const cols = Math.max(1, Math.floor(width / CELL_SIZE))
      const rows = Math.ceil(height / CELL_SIZE) + 2
      setCellCount(cols * rows)
    }

    measure()
    window.addEventListener('resize', measure)
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(document.body)

    return () => {
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
    }
  }, [])

  const grid = Array.from({ length: cellCount }, (_, i) => CHARACTERS[i % CHARACTERS.length])

  return (
    <div
      ref={containerRef}
      className="kana-field pointer-events-none absolute inset-x-0 top-0 -z-10 grid select-none justify-center"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${CELL_SIZE}px, 1fr))`,
        gridAutoRows: `${CELL_SIZE}px`,
        height: '100%',
      }}
      aria-hidden="true"
    >
      {grid.map((ch, i) => (
        <span
          key={i}
          className={`kana-char kana-char-${i % 10} flex items-center justify-center font-display text-lg`}
        >
          {ch}
        </span>
      ))}
    </div>
  )
}
