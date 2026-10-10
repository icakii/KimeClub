import { useTranslation } from 'react-i18next'
import type { MemberBelt } from '../hooks/useMember'
import { beltLabel } from '../lib/belts'

// A tied belt. `stripe` draws a lengthwise second color (e.g. the yellow
// line on a white-yellow 9 kyu belt).
export function BeltIcon({ color, stripe }: { color: string; stripe?: string | null }) {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true">
      <rect x="1" y="10" width="42" height="8" rx="2" fill={color} stroke="var(--color-line)" />
      {stripe && <rect x="1.5" y="12.8" width="41" height="2.4" fill={stripe} />}
      <rect x="16" y="6" width="12" height="16" rx="2.5" fill={color} stroke="var(--color-line)" />
      {stripe && <rect x="16.5" y="12.8" width="11" height="2.4" fill={stripe} />}
      <g transform="rotate(18 17 18)">
        <rect x="14" y="18" width="6" height="11" rx="1.5" fill={color} stroke="var(--color-line)" />
        {stripe && <rect x="16.3" y="18.5" width="1.4" height="10" fill={stripe} />}
      </g>
      <g transform="rotate(-18 27 18)">
        <rect x="24" y="18" width="6" height="11" rx="1.5" fill={color} stroke="var(--color-line)" />
        {stripe && <rect x="26.3" y="18.5" width="1.4" height="10" fill={stripe} />}
      </g>
    </svg>
  )
}

export function BeltChip({ belt, showLabel = true }: { belt: MemberBelt; showLabel?: boolean }) {
  const { i18n } = useTranslation()
  return (
    <span className="inline-flex items-center gap-2">
      <BeltIcon color={belt.color_hex} stripe={belt.color2_hex} />
      {showLabel && (
        <span className="font-display text-sm uppercase tracking-wide text-ink">
          {beltLabel(belt, i18n.resolvedLanguage)}
        </span>
      )}
    </span>
  )
}
