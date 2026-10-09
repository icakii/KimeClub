import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useClub } from '../../hooks/useClub'
import { useClubBilling } from '../../hooks/useClubBilling'
import { useMember } from '../../hooks/useMember'
import { PADDLE_MONTHLY_PRICE_ID } from '../../lib/paddle'

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`
}

export function Subscription() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: billing, isLoading } = useClubBilling(club?.id)
  const [paddle, setPaddle] = useState<Paddle | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined
    const environment = import.meta.env.VITE_PADDLE_ENV as 'sandbox' | 'production' | undefined
    if (!token || !environment) return

    initializePaddle({
      token,
      environment,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') setCompleted(true)
      },
    }).then((p) => p && setPaddle(p))
  }, [])

  if (member && member.role !== 'owner') {
    return <p className="px-6 py-6 text-sm text-muted">{t('admin.subscription.ownerOnly')}</p>
  }

  function openCheckout() {
    paddle?.Checkout.open({
      items: [{ priceId: PADDLE_MONTHLY_PRICE_ID, quantity: 1 }],
      ...(session?.user.email && { customer: { email: session.user.email } }),
    })
  }

  const today = new Date().toISOString().slice(0, 10)
  const overdue = !billing?.paid_until || billing.paid_until < today

  return (
    <div className="px-6 py-6">
      <h1 className="font-display text-xl uppercase tracking-wide text-ink">
        {t('admin.subscription.title')}
      </h1>

      {isLoading && <p className="mt-4 text-sm text-muted">...</p>}

      {billing && (
        <div className="mt-4 max-w-sm space-y-3 rounded-lg border border-line bg-surface p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{t('admin.subscription.plan')}</span>
            <span className="capitalize text-ink">{billing.plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('admin.subscription.monthlyPrice')}</span>
            <span className="text-ink">{formatPrice(billing.monthly_price_cents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('admin.subscription.paidUntil')}</span>
            <span className={overdue ? 'text-aka-text' : 'text-ink'}>
              {billing.paid_until ?? t('admin.subscription.neverPaid')}
            </span>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <span className="text-muted">Status</span>
            <span className={overdue ? 'text-aka-text' : 'text-ink'}>
              {overdue ? t('admin.subscription.overdue') : t('admin.subscription.current')}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={openCheckout}
        disabled={!paddle}
        className="mt-4 min-h-11 rounded-md bg-aka px-6 font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60"
      >
        {paddle ? t('admin.subscription.payButton') : t('admin.subscription.processing')}
      </button>

      {completed && (
        <p className="mt-3 max-w-sm text-sm text-muted">{t('admin.subscription.completedNote')}</p>
      )}
    </div>
  )
}
