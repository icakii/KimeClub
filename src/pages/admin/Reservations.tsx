import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pill, StatCard } from '../../components/admin/ui'
import { PageHeader } from '../../components/app/ui'
import { useClub } from '../../hooks/useClub'
import {
  useClubReservations,
  useSetReservationStatus,
  type ReservationStatus,
  type StaffReservation,
} from '../../hooks/useReservations'

const TONE: Record<ReservationStatus, 'aka' | 'kin' | 'jade' | 'muted'> = {
  new: 'aka',
  ready: 'kin',
  done: 'jade',
  cancelled: 'muted',
}

// What the coach does next with each reservation.
const NEXT: Partial<Record<ReservationStatus, ReservationStatus>> = { new: 'ready', ready: 'done' }

const FILTERS = ['open', 'done', 'all'] as const

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="truncate font-display text-base text-ink">{value || '-'}</p>
    </div>
  )
}

function ReservationCard({ r, clubId }: { r: StaffReservation; clubId: string }) {
  const { t, i18n } = useTranslation()
  const setStatus = useSetReservationStatus(clubId)
  const age = r.member?.birth_year ? new Date().getFullYear() - r.member.birth_year : null
  const next = NEXT[r.status]
  const guardian = [r.member?.guardian_first_name, r.member?.guardian_last_name].filter(Boolean).join(' ')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="relative overflow-hidden rounded-2xl border border-ink/10 bg-shiro/95 p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${r.status === 'new' ? 'bg-aka' : r.status === 'ready' ? 'bg-kin' : 'bg-ink/15'}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
            {r.item_name}
            {r.size && <span className="ml-2 rounded-md bg-ink px-2 py-0.5 text-sm text-shiro">{r.size}</span>}
          </p>
          <p className="text-sm text-muted">
            {(r.price_cents / 100).toFixed(2)} € · {new Date(r.created_at).toLocaleDateString(i18n.resolvedLanguage)}
          </p>
        </div>
        <Pill tone={TONE[r.status]}>{t(`admin.reservations.status.${r.status}`)}</Pill>
      </div>

      <div className="mt-4 rounded-xl bg-kuro/70 p-3">
        <p className="font-display font-semibold uppercase tracking-wide text-ink">{r.member?.full_name ?? '-'}</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          <Detail label={t('admin.detail.age')} value={age != null ? String(age) : null} />
          <Detail label={t('admin.detail.height')} value={r.height_cm ? `${r.height_cm} cm` : null} />
          <Detail label={t('admin.detail.weight')} value={r.weight_kg ? `${r.weight_kg} kg` : null} />
          <Detail label={t('admin.reservations.group')} value={r.member?.group?.name ?? null} />
        </div>
        {(guardian || r.member?.guardian_phone || r.member?.phone) && (
          <p className="mt-2 text-sm text-muted">
            {guardian && `${guardian} · `}
            {r.member?.guardian_phone ?? r.member?.phone}
          </p>
        )}
        {r.note && <p className="mt-2 text-sm italic text-ink">“{r.note}”</p>}
      </div>

      <div className="mt-3 flex gap-2">
        {next && (
          <button
            type="button"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: r.id, status: next })}
            className={`min-h-11 flex-1 rounded-xl font-display text-xs uppercase tracking-wide text-shiro transition-transform active:scale-[0.98] disabled:opacity-60 ${
              next === 'ready' ? 'bg-kin' : 'bg-jade'
            }`}
          >
            {t(`admin.reservations.mark.${next}`)}
          </button>
        )}
        {(r.status === 'new' || r.status === 'ready') && (
          <button
            type="button"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: r.id, status: 'cancelled' })}
            className="min-h-11 rounded-xl border border-ink/15 px-4 font-display text-xs uppercase tracking-wide text-muted hover:text-aka-text"
          >
            {t('admin.reservations.cancel')}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function Reservations() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: reservations, isLoading } = useClubReservations(club?.id)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('open')

  const shown = useMemo(
    () =>
      (reservations ?? []).filter((r) =>
        filter === 'all' ? true : filter === 'open' ? r.status === 'new' || r.status === 'ready' : r.status === 'done',
      ),
    [reservations, filter],
  )

  if (!club) return null
  const count = (s: ReservationStatus) => (reservations ?? []).filter((r) => r.status === s).length

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="店" title={t('admin.reservations.title')} tone="bg-kin" />
      <p className="mt-2 text-sm text-muted">{t('admin.reservations.note')}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard label={t('admin.reservations.status.new')} value={count('new')} kanji="新" tone="bg-aka" />
        <StatCard label={t('admin.reservations.status.ready')} value={count('ready')} kanji="備" tone="bg-kin" />
        <StatCard label={t('admin.reservations.status.done')} value={count('done')} kanji="済" tone="bg-jade" />
      </div>

      <div className="mt-5 flex gap-1 rounded-xl border border-ink/10 bg-shiro/95 p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`relative min-h-10 flex-1 rounded-lg font-display text-xs uppercase tracking-wide ${filter === f ? 'text-shiro' : 'text-muted'}`}
          >
            {filter === f && (
              <motion.span layoutId="res-filter" className="absolute inset-0 rounded-lg bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )}
            <span className="relative">{t(`admin.reservations.filter.${f}`)}</span>
          </button>
        ))}
      </div>

      {isLoading && <p className="p-6 text-center text-muted">...</p>}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((r) => (
            <ReservationCard key={r.id} r={r} clubId={club.id} />
          ))}
        </AnimatePresence>
      </div>
      {!isLoading && shown.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">{t('admin.reservations.empty')}</p>
      )}
    </div>
  )
}
