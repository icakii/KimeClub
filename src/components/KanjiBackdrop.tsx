import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Real dojo vocabulary, not decorative gibberish.
const CHARACTERS = ['空', '手', '道', '気', '心', '力', '型', '礼', '場', '技', '柔', '剛', '極', '武']
const TONES = ['#7a5c2e', '#a82c18', '#2f4f7a', '#2f6b4f']
const CELL = 38
const GRID = 24
const TILE = CELL * GRID
const GLOW_LAYERS = 3

function hash(i: number): number {
  let x = Math.imul(i + 1, 2654435761)
  x ^= x >>> 15
  x = Math.imul(x, 2246822519)
  x ^= x >>> 13
  return x >>> 0
}

// Paints one repeating tile. Layer -1 is the faint base field; layers 0..2
// redraw a scattered ~1/12 of the same cells (same glyph, same spot) much
// stronger, so fading a layer in reads as those characters glowing.
function paintTile(layer: number, baseAlpha: number): string {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const canvas = document.createElement('canvas')
  canvas.width = TILE * dpr
  canvas.height = TILE * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.scale(dpr, dpr)
  ctx.font = `17px 'Yuji Syuku', 'Noto Serif JP', serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const h = hash(row * GRID + col)
      if (layer >= 0 && h % 12 !== layer * 4) continue
      ctx.globalAlpha = layer < 0 ? baseAlpha : 0.32
      ctx.fillStyle = TONES[(h >>> 4) % TONES.length]
      ctx.fillText(CHARACTERS[(h >>> 8) % CHARACTERS.length], col * CELL + CELL / 2, row * CELL + CELL / 2)
    }
  }
  return canvas.toDataURL('image/png')
}

// The dense kanji backdrop, as a handful of pre-rendered image tiles in one
// fixed, viewport-sized layer instead of thousands of DOM nodes. Scrolling
// moves it with a single GPU transform (with parallax: it drifts slower than
// the page), so its cost no longer grows with page height and mobile URL-bar
// resizes don't trigger any re-render.
export function KanjiBackdrop({
  parallax = 0.55,
  baseAlpha = 0.1,
  animated = true,
}: {
  parallax?: number
  baseAlpha?: number
  animated?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const [tiles, setTiles] = useState<string[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const glyphs = CHARACTERS.join('')
    document.fonts
      .load(`17px 'Yuji Syuku'`, glyphs)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        const layers = [paintTile(-1, baseAlpha)]
        if (animated && !reducedMotion) {
          for (let i = 0; i < GLOW_LAYERS; i++) layers.push(paintTile(i, baseAlpha))
        }
        setTiles(layers)
      })
    return () => {
      cancelled = true
    }
  }, [animated, baseAlpha, reducedMotion])

  useEffect(() => {
    if (reducedMotion || parallax === 0) return
    let frame = 0
    function update() {
      frame = 0
      const offset = (window.scrollY * parallax) % TILE
      if (layerRef.current) layerRef.current.style.transform = `translate3d(0, ${-offset}px, 0)`
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [parallax, reducedMotion])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        ref={layerRef}
        className="absolute inset-x-0 top-0 will-change-transform"
        style={{ height: `calc(100% + ${TILE}px)` }}
      >
        {tiles?.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 ${i === 0 ? 'fade-in' : `kanji-glow kanji-glow-${i}`}`}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${TILE}px ${TILE}px`,
              backgroundPosition: 'center top',
            }}
          />
        ))}
      </div>
    </div>
  )
}
