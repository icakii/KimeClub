import { useTranslation } from 'react-i18next'

export type PaymentStatusKey = 'trial' | 'paid' | 'due' | 'overdue' | 'waived' | 'unknown'

const STYLES: Record<PaymentStatusKey, string> = {
  trial: 'bg-surface border border-line text-muted',
  paid: 'bg-belt-green text-[#111114]',
  due: 'bg-belt-yellow text-[#111114]',
  overdue: 'bg-aka text-shiro',
  waived: 'bg-surface border border-line text-muted',
  unknown: 'bg-surface border border-line text-muted',
}

export function PaymentStatusChip({ status }: { status: PaymentStatusKey }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-display text-xs uppercase tracking-wide ${STYLES[status]}`}
    >
      {t(`paymentStatus.${status}`)}
    </span>
  )
}
