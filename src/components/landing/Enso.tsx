import { useReducedMotion } from '../../hooks/useReducedMotion'

const SIZE = 96
const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP_DEGREES = 46
const VISIBLE_LENGTH = (CIRCUMFERENCE * (360 - GAP_DEGREES)) / 360
const GAP_LENGTH = CIRCUMFERENCE - VISIBLE_LENGTH

export function Enso({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--color-aka)"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`${VISIBLE_LENGTH} ${GAP_LENGTH}`}
        transform={`rotate(-100 ${SIZE / 2} ${SIZE / 2})`}
        style={
          reducedMotion
            ? undefined
            : ({
                '--dash': VISIBLE_LENGTH,
                animation: 'enso-draw 1.1s ease-out 0.15s forwards',
              } as React.CSSProperties)
        }
      />
    </svg>
  )
}
