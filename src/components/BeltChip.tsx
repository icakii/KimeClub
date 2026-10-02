import { useTranslation } from 'react-i18next'
import type { MemberBelt } from '../hooks/useMember'

function BeltIcon({ color }: { color: string }) {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true">
      <rect x="1" y="10" width="42" height="8" rx="2" fill={color} stroke="var(--color-line)" />
      <rect
        x="16"
        y="6"
        width="12"
        height="16"
        rx="2.5"
        fill={color}
        stroke="var(--color-line)"
      />
      <rect
        x="14"
        y="18"
        width="6"
        height="11"
        rx="1.5"
        fill={color}
        stroke="var(--color-line)"
        transform="rotate(18 17 18)"
      />
      <rect
        x="24"
        y="18"
        width="6"
        height="11"
        rx="1.5"
        fill={color}
        stroke="var(--color-line)"
        transform="rotate(-18 27 18)"
      />
    </svg>
  )
}

export function BeltChip({ belt }: { belt: MemberBelt }) {
  const { i18n } = useTranslation()
  return (
    <span className="inline-flex items-center gap-2">
      <BeltIcon color={belt.color_hex} />
      <span className="font-display text-sm uppercase tracking-wide text-ink">
        {i18n.resolvedLanguage === 'en' ? belt.name_en : belt.name_bg}
      </span>
    </span>
  )
}
