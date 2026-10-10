import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBelts, type Belt } from '../../hooks/useBelts'
import { beltColorName, beltGrade, groupByColor } from '../../lib/belts'
import { BeltIcon } from '../BeltChip'
import { SectionHeading } from './Section'

// Dan grades beyond this many are summarised ("... 10 дан") in the list.
const MAX_LISTED = 3

function gradeRange(group: Belt[], lang: string | undefined): string | null {
  const first = beltGrade(group[0], lang)
  const last = beltGrade(group[group.length - 1], lang)
  if (!first) return null
  if (group.length === 1 || !last) return first
  // "5 кю – 4 кю" reads as "5–4 кю"; keep the unit once.
  const [n1, ...unit1] = first.split(' ')
  const [n2, ...unit2] = last.split(' ')
  return unit1.join(' ') === unit2.join(' ') ? `${n1}–${n2} ${unit1.join(' ')}` : `${first} – ${last}`
}

function BeltGroup({ group, index }: { group: Belt[]; index: number }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  const [open, setOpen] = useState(false)
  const belt = group[0]
  const many = group.length > 1
  const listed = group.length > MAX_LISTED + 1 ? group.slice(0, MAX_LISTED) : group
  const hidden = group.length - listed.length

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, rotate: -8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.3 + index * 0.08 }}
      className="flex w-24 flex-col items-center gap-2"
    >
      {/* Light disc so white and black belts both read on the ink panel. */}
      <div className="relative">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-shiro/90 shadow-[0_0_0_6px_rgba(251,246,234,0.08)]">
          <BeltIcon color={belt.color_hex} stripe={belt.color2_hex} />
        </span>
        {many && (
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={t('beltLadder.showGrades')}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-kin text-ink shadow-md ring-2 ring-ink"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </div>
      <span className="text-center font-display text-[11px] uppercase tracking-[0.2em] text-shiro/80">
        {beltColorName(belt, lang)}
      </span>
      <span className="font-display text-xs text-kin/90">{gradeRange(group, lang)}</span>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full overflow-hidden rounded-xl bg-shiro/10"
          >
            {listed.map((g) => (
              <li key={g.id} className="border-b border-shiro/10 px-2 py-1.5 text-center font-display text-xs text-shiro last:border-0">
                {beltGrade(g, lang)}
              </li>
            ))}
            {hidden > 0 && (
              <li className="px-2 py-1.5 text-center font-display text-xs text-shiro/60">
                … {beltGrade(group[group.length - 1], lang)}
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function BeltLadder({ clubId }: { clubId: string | undefined }) {
  const { t } = useTranslation()
  const { data: belts } = useBelts(clubId)
  const groups = groupByColor(belts ?? [])

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kanji="帯" title={t('beltLadder.title')} tone="jade" />

        <div className="relative mt-14 overflow-hidden rounded-3xl bg-ink px-6 py-12 shadow-[0_40px_80px_-40px_rgba(31,27,22,0.8)] sm:px-10">
          <span
            className="pointer-events-none absolute -bottom-16 -left-4 font-brush text-[14rem] leading-none text-shiro/5"
            aria-hidden="true"
          >
            帯
          </span>

          <div className="relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-4 right-4 top-8 hidden h-0.5 origin-left bg-linear-to-r from-shiro/60 via-kin to-aka lg:block"
            />
            <div className="relative flex flex-wrap items-start justify-center gap-x-4 gap-y-8 lg:flex-nowrap lg:justify-between lg:gap-x-0">
              {groups.map((group, i) => (
                <BeltGroup key={group[0].id} group={group} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
