import type { ReactNode } from 'react'

// Summary tile for the admin pages: paper card, colored rule on top and a
// faint kanji watermark, same language as the student app's cards.
export function StatCard({
  label,
  value,
  hint,
  kanji,
  tone = 'bg-aka',
}: {
  label: string
  value: ReactNode
  hint?: string
  kanji: string
  tone?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 p-5 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
      <span className={`absolute inset-x-0 top-0 h-1 ${tone}`} />
      <span
        className="pointer-events-none absolute -bottom-5 right-2 font-brush text-7xl leading-none text-ink/5"
        aria-hidden="true"
      >
        {kanji}
      </span>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold leading-none text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  )
}

const PILL_TONES = {
  jade: 'bg-jade/12 text-jade ring-jade/25',
  kin: 'bg-kin/15 text-gold ring-kin/35',
  aka: 'bg-aka/10 text-aka-text ring-aka/25',
  muted: 'bg-ink/5 text-muted ring-ink/10',
  ai: 'bg-ai/10 text-ai ring-ai/20',
} as const

export function Pill({ tone, children }: { tone: keyof typeof PILL_TONES; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] uppercase tracking-wide ring-1 ${PILL_TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
