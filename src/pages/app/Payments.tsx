import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PaymentStatusChip } from '../../components/PaymentStatusChip'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { usePayments } from '../../hooks/usePayments'

export function Payments() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: payments } = usePayments(member?.id)

  const today = new Date().toISOString().slice(0, 10)
  const paidThrough = (payments ?? [])
    .filter((p) => p.status === 'paid')
    .reduce<string | null>((max, p) => (!max || p.period_end > max ? p.period_end : max), null)
  const overdue = !paidThrough || paidThrough < today

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('paymentsPage.title')}</h1>

      <div className="mt-4 rounded-lg border border-line bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t('paymentsPage.paidThrough')}
        </p>
        <p className={`mt-1 font-display text-lg ${overdue ? 'text-aka-text' : 'text-ink'}`}>
          {paidThrough
            ? new Date(`${paidThrough}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : t('paymentsPage.neverPaid')}
        </p>
      </div>

      <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
        {payments && payments.length > 0 ? (
          payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-ink">
                  {new Date(p.period_start).toLocaleDateString(i18n.resolvedLanguage, {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted">
                  {(p.amount_cents / 100).toFixed(2)} {p.currency}
                </p>
              </div>
              <PaymentStatusChip status={p.status} />
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">{t('paymentsPage.empty')}</p>
        )}
      </div>

      <Link
        to="/store"
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md border border-line px-4 font-display text-sm uppercase tracking-wide text-ink"
      >
        {t('store.navLink')}
      </Link>
    </div>
  )
}
