import type { Belt } from '../hooks/useBelts'

type BeltLike = Pick<Belt, 'name_bg' | 'name_en' | 'grade_bg' | 'grade_en'>

export function beltColorName(belt: BeltLike, lang: string | undefined): string {
  return lang === 'en' ? belt.name_en : belt.name_bg
}

export function beltGrade(belt: BeltLike, lang: string | undefined): string | null {
  return (lang === 'en' ? belt.grade_en : belt.grade_bg) ?? null
}

// "Кафяво · 3 кю", or just the color for clubs without grades.
export function beltLabel(belt: BeltLike, lang: string | undefined): string {
  const grade = beltGrade(belt, lang)
  return grade ? `${beltColorName(belt, lang)} · ${grade}` : beltColorName(belt, lang)
}

// Consecutive grades sharing a color collapse into one group (5-4 kyu blue,
// 3-1 kyu brown, 1-10 dan black). Input must be sorted by rank.
export function groupByColor<T extends Belt>(belts: T[]): T[][] {
  const groups: T[][] = []
  for (const belt of belts) {
    const last = groups[groups.length - 1]
    if (last && last[0].name_bg === belt.name_bg && last[0].color2_hex === belt.color2_hex) last.push(belt)
    else groups.push([belt])
  }
  return groups
}

// A class's belt range as grades: "10–7 кю", "5 кю – 10 дан". Falls back to
// color names for clubs without grades, and to raw ranks if belts haven't
// loaded.
export function rankRangeLabel(belts: Belt[] | undefined, min: number, max: number, lang: string | undefined): string {
  const lo = belts?.find((b) => b.rank === min)
  const hi = belts?.find((b) => b.rank === max)
  if (!lo || !hi) return `${min} – ${max}`
  const a = beltGrade(lo, lang) ?? beltColorName(lo, lang)
  const b = beltGrade(hi, lang) ?? beltColorName(hi, lang)
  if (a === b) return a
  const [n1, ...u1] = a.split(' ')
  const [n2, ...u2] = b.split(' ')
  return u1.length && u1.join(' ') === u2.join(' ') ? `${n1}–${n2} ${u1.join(' ')}` : `${a} – ${b}`
}
