import { useId } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RADIUS = 78
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP_DEGREES = 38
const VISIBLE = (CIRCUMFERENCE * (360 - GAP_DEGREES)) / 360

// The club mark: a brush-stroke ensō around 極 (kime -- the instant of total
// focus a technique lands with). `animated` draws the ring and fades the
// kanji in on mount; the compact nav version renders static.
export function Emblem({
  className = '',
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const reducedMotion = useReducedMotion()
  animated = animated && !reducedMotion

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Kime">
      <defs>
        {/* Rough, dry-brush edge: turbulence displacing the stroke. */}
        <filter id={`brush-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        <linearGradient id={`ink-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-ink)" />
          <stop offset="100%" stopColor="var(--color-ai)" />
        </linearGradient>
      </defs>

      <circle
        cx="100"
        cy="100"
        r={RADIUS}
        fill="none"
        stroke={`url(#ink-${id})`}
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray={`${VISIBLE} ${CIRCUMFERENCE}`}
        transform="rotate(-62 100 100)"
        filter={`url(#brush-${id})`}
        style={
          animated
            ? ({
                '--dash': VISIBLE,
                strokeDashoffset: VISIBLE,
                animation: 'enso-draw 1.3s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards',
              } as React.CSSProperties)
            : undefined
        }
      />

      <text
        x="100"
        y="103"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-brush)"
        fontSize="92"
        fill="var(--color-ink)"
        className={animated ? 'fade-in' : undefined}
        style={animated ? { animationDelay: '1.4s' } : undefined}
      >
        極
      </text>
    </svg>
  )
}
