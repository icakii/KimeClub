import { useTranslation } from 'react-i18next'
import { BeltChip } from '../../components/BeltChip'
import { InstallHintCard } from '../../components/InstallHintCard'
import { PaymentStatusChip, type PaymentStatusKey } from '../../components/PaymentStatusChip'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { useNextClass } from '../../hooks/useNextClass'
import { useNotifications } from '../../hooks/useNotifications'
import { usePayments } from '../../hooks/usePayments'

export function Home() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const nextClass = useNextClass(club?.id, member?.group_id)
  const { data: payments } = usePayments(member?.id)
  const { data: notifications } = useNotifications(member?.id)

  if (!member) {
    return <div className="flex min-h-screen items-center justify-center text-muted">...</div>
  }

  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]
  const paymentStatus: PaymentStatusKey =
    member.status === 'trial' ? 'trial' : (payments?.[0]?.status ?? 'unknown')
  const latestMessage = notifications?.[0]

  return (
    <div className="space-y-6 px-6 pb-6 pt-8">
      <div>
        <p className="font-display text-xl uppercase tracking-wide">
          {t('studentHome.greeting', { name: member.full_name.split(' ')[0] })}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {member.belt && <BeltChip belt={member.belt} showLabel={false} />}
          <PaymentStatusChip status={paymentStatus} />
        </div>
      </div>

      <InstallHintCard />

      <section className="rounded-lg border border-line bg-surface p-4">
        <h2 className="font-display text-xs uppercase tracking-wide text-muted">
          {t('studentHome.nextClass')}
        </h2>
        {nextClass ? (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <p className="font-display uppercase tracking-wide text-ink">
                {nextClass.class.title}
              </p>
              {nextClass.notice && (
                <span className="rounded-full bg-aka px-2 py-0.5 text-[10px] font-display uppercase tracking-wide text-shiro">
                  {t('studentHome.changed')}
                </span>
              )}
            </div>
            <p className="text-sm text-muted">
              {weekdays[nextClass.class.weekday]} ·{' '}
              {(nextClass.notice?.new_start_time ?? nextClass.class.start_time).slice(0, 5)}
            </p>
            {nextClass.notice && (
              <p className="mt-1 text-sm text-aka-text">{nextClass.notice.note}</p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">{t('studentHome.noNextClass')}</p>
        )}
      </section>

      <section className="rounded-lg border border-line bg-surface p-4">
        <h2 className="font-display text-xs uppercase tracking-wide text-muted">
          {t('studentHome.latestMessage')}
        </h2>
        {latestMessage ? (
          <div className="mt-2">
            <p className="font-display uppercase tracking-wide text-ink">
              {latestMessage.title}
            </p>
            <p className="mt-1 text-sm text-muted">{latestMessage.body}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">{t('studentHome.noMessages')}</p>
        )}
      </section>

      <section>
        <h2 className="font-display text-xs uppercase tracking-wide text-muted">
          {t('studentHome.inbox')}
        </h2>
        <div className="mt-2 divide-y divide-line rounded-lg border border-line bg-surface">
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <div key={n.id} className="p-3">
                <p className="font-display text-sm uppercase tracking-wide text-ink">
                  {n.title}
                </p>
                <p className="mt-1 text-sm text-muted">{n.body}</p>
                <p className="mt-1 text-xs text-muted-2">
                  {new Date(n.created_at).toLocaleDateString(i18n.resolvedLanguage)}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-sm text-muted">{t('studentHome.noMessages')}</p>
          )}
        </div>
      </section>
    </div>
  )
}
