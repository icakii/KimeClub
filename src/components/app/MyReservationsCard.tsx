import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCancelMyReservation, useMyReservations } from '../../hooks/useReservations'
import { Pill } from '../admin/ui'

const TONE = { new: 'aka', ready: 'kin', done: 'jade', cancelled: 'muted' } as const

// The student's own store reservations, with "ready for pickup" from the coach.
export function MyReservationsCard({ memberId }: { memberId: string }) {
  const { t } = useTranslation()
  const { data: reservations } = useMyReservations(memberId)
  const cancel = useCancelMyReservation(memberId)

  return (
    <div className="rounded-3xl border border-ink/10 bg-shiro/95 p-5 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t('store.mine.title')}</p>
        <Link to="/store" className="font-display text-xs uppercase tracking-wide text-aka-text">
          {t('store.mine.open')} →
        </Link>
      </div>
      {!reservations?.length ? (
        <p className="mt-2 text-sm text-muted">{t('store.mine.none')}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {reservations.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 border-t border-ink/10 pt-2">
              <div className="min-w-0">
                <p className="truncate font-display text-sm uppercase tracking-wide text-ink">
                  {r.item_name}
                  {r.size && ` · ${r.size}`}
                </p>
                <p className="text-xs text-muted">{(r.price_cents / 100).toFixed(2)} €</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Pill tone={TONE[r.status]}>{t(`store.mine.status.${r.status}`)}</Pill>
                {r.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => cancel.mutate(r.id)}
                    className="text-xs text-muted hover:text-aka-text"
                    aria-label={t('store.mine.cancel')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
