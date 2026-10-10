import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { KanjiBackdrop } from '../components/KanjiBackdrop'
import { Emblem } from '../components/landing/Emblem'
import { Reveal, SectionHeading } from '../components/landing/Section'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Example catalogue: drawn product art instead of photos, prices in EUR.
// Reserving just says "pay and pick up at the dojo"; there's no online
// checkout for merchandise.

function TeeArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <path
        d="M70 38 L50 46 L22 74 L42 98 L58 86 L58 168 L142 168 L142 86 L158 98 L178 74 L150 46 L130 38 C124 52 112 58 100 58 C88 58 76 52 70 38 Z"
        fill="#1f1b16"
      />
      <path d="M70 38 C76 52 88 58 100 58 C112 58 124 52 130 38" fill="none" stroke="#3a332a" strokeWidth="4" />
      <circle cx="100" cy="106" r="22" fill="none" stroke="#fbf6ea" strokeWidth="3" />
      <text x="100" y="116" textAnchor="middle" fontSize="26" fill="#fbf6ea" fontFamily="'Yuji Syuku', serif">
        極
      </text>
      <text x="100" y="146" textAnchor="middle" fontSize="11" letterSpacing="5" fill="#c9973f" fontFamily="Oswald, sans-serif">
        KIME
      </text>
    </svg>
  )
}

function GiArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <path
        d="M66 30 L36 44 L14 92 L36 104 L52 76 L54 170 L146 170 L148 76 L164 104 L186 92 L164 44 L134 30 Z"
        fill="#fbf6ea"
        stroke="#d4c49c"
        strokeWidth="3"
      />
      {/* Crossed lapels. */}
      <path d="M66 30 L100 112 L134 30" fill="none" stroke="#d4c49c" strokeWidth="10" strokeLinejoin="round" />
      <path d="M66 30 L112 120" fill="none" stroke="#e8dcc0" strokeWidth="8" />
      {/* Black belt with knot. */}
      <rect x="52" y="118" width="96" height="14" rx="2" fill="#1f1b16" />
      <rect x="92" y="114" width="18" height="22" rx="3" fill="#1f1b16" />
      <path d="M96 134 L86 162 L96 164 L104 136 Z M106 134 L116 160 L124 156 L112 132 Z" fill="#1f1b16" />
      <rect x="132" y="120" width="10" height="10" fill="#c2361f" />
    </svg>
  )
}

function BagArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* Drawstrings. */}
      <path d="M62 50 C40 90 44 150 56 176" fill="none" stroke="#1f1b16" strokeWidth="4" />
      <path d="M138 50 C160 90 156 150 144 176" fill="none" stroke="#1f1b16" strokeWidth="4" />
      <path d="M56 40 L144 40 L150 176 L50 176 Z" fill="#c2361f" />
      <path d="M56 40 L144 40 L145 54 L55 54 Z" fill="#a82c18" />
      <path d="M62 47 C90 60 110 60 138 47" fill="none" stroke="#1f1b16" strokeWidth="4" />
      <rect x="70" y="88" width="60" height="60" rx="4" fill="#fbf6ea" transform="rotate(-6 100 118)" />
      <text
        x="100"
        y="130"
        textAnchor="middle"
        fontSize="34"
        fill="#c2361f"
        fontFamily="'Yuji Syuku', serif"
        transform="rotate(-6 100 118)"
      >
        道
      </text>
    </svg>
  )
}

function BeltArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="18" y="86" width="164" height="22" rx="4" fill="#1f1b16" />
      <rect x="86" y="78" width="28" height="36" rx="5" fill="#2a251f" />
      <path d="M92 112 L76 168 L90 170 L102 116 Z" fill="#1f1b16" />
      <path d="M108 112 L124 166 L138 162 L116 110 Z" fill="#1f1b16" />
      <rect x="150" y="90" width="8" height="14" fill="#c9973f" />
      <rect x="162" y="90" width="8" height="14" fill="#c9973f" />
    </svg>
  )
}

const ITEMS: { key: string; price: number; art: ReactNode; bg: string; sizes?: string[]; badge?: 'new' | 'popular' }[] = [
  { key: 'tee', price: 25, art: <TeeArt />, bg: 'from-kin/25 to-sakura/30', sizes: ['XS', 'S', 'M', 'L', 'XL'], badge: 'new' },
  { key: 'gi', price: 59, art: <GiArt />, bg: 'from-ai/25 to-ai-soft/10', sizes: ['130', '140', '150', '160', '170', '180'], badge: 'popular' },
  { key: 'bag', price: 18, art: <BagArt />, bg: 'from-jade/20 to-kin/15' },
  { key: 'belt', price: 12, art: <BeltArt />, bg: 'from-aka/15 to-kin/20', sizes: ['220', '240', '260', '280'] },
]

function ProductCard({ item, index }: { item: (typeof ITEMS)[number]; index: number }) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [size, setSize] = useState(item.sizes?.[Math.floor((item.sizes.length - 1) / 2)])
  const [reserved, setReserved] = useState(false)

  return (
    <Reveal delay={index * 0.08}>
      <motion.div
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-shiro/95 shadow-[0_24px_48px_-32px_rgba(31,27,22,0.6)]"
      >
        <div className={`relative aspect-square bg-linear-to-br ${item.bg}`}>
          {item.badge && (
            <span
              className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide text-shiro ${
                item.badge === 'new' ? 'bg-aka' : 'bg-ai'
              }`}
            >
              {t(`store.badge.${item.badge}`)}
            </span>
          )}
          <motion.div
            className="absolute inset-8"
            whileHover={reduced ? undefined : { rotate: -4, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          >
            {item.art}
          </motion.div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              {t(`store.items.${item.key}.name`)}
            </h3>
            <p className="shrink-0 whitespace-nowrap font-display text-xl font-bold text-aka-text">{item.price} €</p>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t(`store.items.${item.key}.desc`)}</p>

          {item.sizes && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`relative min-w-10 rounded-lg px-2 py-1.5 font-display text-xs transition-colors ${
                    size === s ? 'text-shiro' : 'border border-ink/15 text-muted hover:text-ink'
                  }`}
                >
                  {size === s && (
                    <motion.span
                      layoutId={`size-${item.key}`}
                      className="absolute inset-0 rounded-lg bg-ink"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={() => setReserved(true)}
              className={`relative min-h-11 w-full overflow-hidden rounded-xl font-display text-sm uppercase tracking-wide transition-colors ${
                reserved ? 'bg-jade text-shiro' : 'bg-ink text-shiro hover:bg-aka'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={reserved ? 'done' : 'idle'}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  className="block"
                >
                  {reserved ? `✓ ${t('store.reserved')}` : t('store.reserve')}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

export function Store() {
  const { t } = useTranslation()

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <KanjiBackdrop />
      <div className="kana-vignette" />
      <header className="sticky top-0 z-20 border-b border-line/60 bg-kuro/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Emblem className="h-9 w-9" />
            <span className="font-display text-base font-semibold uppercase tracking-[0.3em] text-ink">Kime</span>
          </Link>
          <Link to="/" className="font-display text-xs uppercase tracking-wide text-muted hover:text-aka-text">
            ← {t('privacy.back')}
          </Link>
        </div>
      </header>

      <main className="relative px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kanji="店" title={t('store.title')} tone="aka" />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-center text-muted">{t('store.body')}</p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map((item, i) => (
              <ProductCard key={item.key} item={item} index={i} />
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-2">{t('store.note')}</p>
        </div>
      </main>
    </div>
  )
}
