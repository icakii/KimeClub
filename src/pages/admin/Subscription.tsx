import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { useClub } from '../../hooks/useClub'
import { useClubBilling } from '../../hooks/useClubBilling'
import { useMember } from '../../hooks/useMember'
import { PADDLE_MONTHLY_PRICE_ID } from '../../lib/paddle'
import { PageHeader } from '../../components/app/ui'

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
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined
    const environment = import.meta.env.VITE_PADDLE_ENV as 'sandbox' | 'production' | undefined
    if (!token || !environment) return

    initializePaddle({
      token,
      environment,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          setCompleted(true)
          // The webhook that actually updates paid_until lands a moment
          // after the client-side event, not before it — refetch a couple
          // of times rather than once so the UI catches up once it arrives.
          const queryKey = ['club-billing', club?.id]
          queryClient.invalidateQueries({ queryKey })
          setTimeout(() => queryClient.invalidateQueries({ queryKey }), 4000)
          setTimeout(() => queryClient.invalidateQueries({ queryKey }), 10000)
        }
      },
    }).then((p) => p && setPaddle(p))
  }, [club?.id, queryClient])

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
    <div className="px-5 py-6">
      <PageHeader kanji="契" title={t('admin.subscription.title')} tone="bg-ink" />

      {isLoading && <p className="mt-4 text-sm text-muted">...</p>}

      {billing && (
        <div className="relative mt-5 max-w-md overflow-hidden rounded-3xl bg-ink p-6 text-shiro shadow-[0_24px_48px_-24px_rgba(31,27,22,0.8)]">
          <span
            className="pointer-events-none absolute -bottom-10 -right-4 font-brush text-[9rem] leading-none text-shiro/5"
            aria-hidden="true"
          >
            道
          </span>
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-shiro/60">
                {t('admin.subscription.plan')} · <span className="capitalize">{billing.plan}</span>
              </p>
              <p className="mt-2 font-display text-4xl font-bold leading-none">
                {formatPrice(billing.monthly_price_cents)}
              </p>
              <p className="mt-1 text-xs text-shiro/60">{t('admin.subscription.monthlyPrice')}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide ${
                overdue ? 'bg-aka text-shiro' : 'bg-jade text-shiro'
              }`}
            >
              {overdue ? t('admin.subscription.overdue') : t('admin.subscription.current')}
            </span>
          </div>
          <div className="relative mt-6 flex items-center justify-between rounded-2xl bg-shiro/10 px-4 py-3 text-sm">
            <span className="text-shiro/70">{t('admin.subscription.paidUntil')}</span>
            <span className={`font-display tracking-wide ${overdue ? 'text-sakura' : 'text-shiro'}`}>
              {billing.paid_until ?? t('admin.subscription.neverPaid')}
            </span>
          </div>
          <button
            type="button"
            onClick={openCheckout}
            disabled={!paddle}
            className="relative mt-4 min-h-12 w-full rounded-2xl bg-aka px-6 font-display text-sm uppercase tracking-wide text-shiro shadow-[0_12px_24px_-12px_rgba(194,54,31,0.9)] transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {paddle ? t('admin.subscription.payButton') : t('admin.subscription.processing')}
          </button>
        </div>
      )}

      {completed && (
        <p className="mt-3 max-w-md text-sm text-muted">{t('admin.subscription.completedNote')}</p>
      )}
    </div>
  )
}
