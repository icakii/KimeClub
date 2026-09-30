import { useTranslation } from 'react-i18next'
import type { MemberBelt } from '../hooks/useMember'

const DARK_TEXT_BELTS = new Set(['white', 'yellow', 'orange', 'green'])

function textColor(nameEn: string): string {
  return DARK_TEXT_BELTS.has(nameEn.toLowerCase()) ? '#111114' : '#f6f3ec'
}

export function BeltChip({ belt }: { belt: MemberBelt }) {
  const { i18n } = useTranslation()
  return (
    <span
      className="inline-flex rounded-full border border-line/60 px-4 py-1.5 font-display text-sm uppercase tracking-wide"
      style={{ background: belt.color_hex, color: textColor(belt.name_en) }}
    >
      {i18n.resolvedLanguage === 'en' ? belt.name_en : belt.name_bg}
    </span>
  )
}
