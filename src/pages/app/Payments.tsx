import { useTranslation } from 'react-i18next'
import { PaymentStatusChip } from '../../components/PaymentStatusChip'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { usePayments } from '../../hooks/usePayments'

export function Payments() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: payments } = usePayments(member?.id)

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('paymentsPage.title')}</h1>

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
    </div>
  )
}
