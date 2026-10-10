import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AttendanceCard } from '../../components/app/AttendanceCard'
import { Card, DAY_KANJI, Eyebrow, Stagger, StaggerItem } from '../../components/app/ui'
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
    return <div className="flex min-h-[60vh] items-center justify-center text-muted">...</div>
  }

  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]
  const paymentStatus: PaymentStatusKey =
    member.status === 'trial' ? 'trial' : (payments?.[0]?.status ?? 'unknown')

  return (
    <Stagger className="space-y-4 px-5 pb-6 pt-5">
      <StaggerItem>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-ai via-ai to-ai-soft p-6 text-shiro shadow-[0_24px_48px_-24px_rgba(31,51,82,0.8)]">
          <span
            className="pointer-events-none absolute -bottom-8 -right-4 font-brush text-[9rem] leading-none text-shiro/10"
            aria-hidden="true"
          >
            極
          </span>
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(194,54,31,0.45), transparent)' }}
          />
          <p className="relative text-[10px] uppercase tracking-[0.25em] text-shiro/60">{club?.name}</p>
          <p className="relative mt-1 font-display text-3xl font-bold uppercase tracking-wide">
            {t('studentHome.greeting', { name: member.full_name.split(' ')[0] })}
          </p>
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            {member.belt && (
              <span className="rounded-full bg-shiro/95 px-2 py-1">
                <BeltChip belt={member.belt} showLabel={false} />
              </span>
            )}
            {member.role === 'student' && <PaymentStatusChip status={paymentStatus} />}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <InstallHintCard />
      </StaggerItem>

      <StaggerItem>
        {nextClass ? (
          <div className="relative flex overflow-hidden rounded-3xl bg-aka text-shiro shadow-[0_20px_40px_-20px_rgba(194,54,31,0.85)]">
            <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-ink/15">
              <span className="font-brush text-5xl leading-none">{DAY_KANJI[nextClass.class.weekday]}</span>
            </div>
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-shiro/70">
                  {t('studentHome.nextClass')}
                </p>
                {nextClass.notice && (
                  <span className="rounded-full bg-shiro px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-aka">
                    {t('studentHome.changed')}
                  </span>
                )}
              </div>
              <p className="mt-1 font-display text-xl font-bold uppercase tracking-wide">
                {nextClass.class.title}
              </p>
              <p className="mt-2 font-display text-3xl font-bold leading-none">
                {(nextClass.notice?.new_start_time ?? nextClass.class.start_time).slice(0, 5)}
              </p>
              <p className="mt-1 text-xs text-shiro/80">
                {weekdays[nextClass.class.weekday]}
                {nextClass.class.room && ` · ${nextClass.class.room}`}
              </p>
              {nextClass.notice && <p className="mt-2 text-sm text-shiro">{nextClass.notice.note}</p>}
            </div>
          </div>
        ) : (
          <Card>
            <Eyebrow>{t('studentHome.nextClass')}</Eyebrow>
            <p className="mt-2 text-sm text-muted">{t('studentHome.noNextClass')}</p>
          </Card>
        )}
      </StaggerItem>

      {(member.role === 'owner' || member.role === 'coach') && (
        <StaggerItem>
          <Link
            to="/admin/payments"
            className="flex items-center justify-between gap-3 rounded-3xl bg-ink p-5 text-shiro shadow-[0_20px_40px_-24px_rgba(31,27,22,0.8)] transition-transform active:scale-[0.98]"
          >
            <div>
              <p className="font-display text-lg font-semibold uppercase tracking-wide">{t('studentHome.staffCard.title')}</p>
              <p className="text-xs text-shiro/65">{t('studentHome.staffCard.body')}</p>
            </div>
            <span className="rounded-full bg-aka px-3 py-2 font-display text-sm">→</span>
          </Link>
        </StaggerItem>
      )}

      {member.role === 'student' && (
        <StaggerItem>
          <AttendanceCard memberId={member.id} />
        </StaggerItem>
      )}

      <StaggerItem>
        <Eyebrow className="px-1 pt-2">{t('studentHome.inbox')}</Eyebrow>
      </StaggerItem>

      {notifications && notifications.length > 0 ? (
        notifications.map((n, i) => (
          <StaggerItem key={n.id}>
            <Card className="flex gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  i === 0 ? 'bg-aka' : n.read_at ? 'bg-line' : 'bg-jade'
                }`}
              />
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                  {n.title}
                </p>
                <p className="mt-1 text-sm text-muted">{n.body}</p>
                <p className="mt-2 text-[11px] text-muted-2">
                  {new Date(n.created_at).toLocaleDateString(i18n.resolvedLanguage)}
                </p>
              </div>
            </Card>
          </StaggerItem>
        ))
      ) : (
        <StaggerItem>
          <Card>
            <p className="text-sm text-muted">{t('studentHome.noMessages')}</p>
          </Card>
        </StaggerItem>
      )}
    </Stagger>
  )
}
