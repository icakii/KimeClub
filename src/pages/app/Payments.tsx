import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, Eyebrow, PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
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
    <div className="px-5 pb-6 pt-5">
      <PageHeader kanji="払" title={t('paymentsPage.title')} />

      <Stagger className="mt-5 space-y-4">
        <StaggerItem>
          <div
            className={`relative overflow-hidden rounded-3xl p-6 text-shiro ${
              overdue
                ? 'bg-linear-to-br from-aka to-aka-text shadow-[0_24px_48px_-24px_rgba(194,54,31,0.9)]'
                : 'bg-linear-to-br from-jade to-[#1f4a36] shadow-[0_24px_48px_-24px_rgba(47,107,79,0.9)]'
            }`}
          >
            <span
              className="pointer-events-none absolute -bottom-8 -right-3 font-brush text-[8rem] leading-none text-shiro/10"
              aria-hidden="true"
            >
              払
            </span>
            <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-shiro/70">
              {t('paymentsPage.paidThrough')}
            </p>
            <p
              className={`relative mt-2 font-display font-bold uppercase leading-tight ${
                paidThrough ? 'text-3xl' : 'text-xl'
              }`}
            >
              {paidThrough
                ? new Date(`${paidThrough}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : t('paymentsPage.neverPaid')}
            </p>
            {!overdue && (
              <span
                className="stamp-in absolute right-5 top-5 rounded-sm border-2 border-shiro px-2 py-1 font-display text-xs font-bold uppercase tracking-widest"
                style={{ animationDelay: '0.45s' }}
              >
                {t('paymentStatus.paid')}
              </span>
            )}
          </div>
        </StaggerItem>

        <StaggerItem>
          <Eyebrow className="px-1 pt-2">{t('paymentShowcase.mock.history')}</Eyebrow>
        </StaggerItem>

        {payments && payments.length > 0 ? (
          <StaggerItem>
            <Card className="divide-y divide-line p-0">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                      {new Date(p.period_start).toLocaleDateString(i18n.resolvedLanguage, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-muted">
                      {(p.amount_cents / 100).toFixed(2)} {p.currency}
                    </p>
                  </div>
                  <PaymentStatusChip status={p.status} />
                </div>
              ))}
            </Card>
          </StaggerItem>
        ) : (
          <StaggerItem>
            <Card>
              <p className="text-sm text-muted">{t('paymentsPage.empty')}</p>
            </Card>
          </StaggerItem>
        )}

        <StaggerItem>
          <Link
            to="/store"
            className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-ink/15 bg-shiro/95 px-4 font-display text-sm uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text"
          >
            {t('store.navLink')}
          </Link>
        </StaggerItem>
      </Stagger>
    </div>
  )
}
