import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MemberAvatar } from '../../components/admin/MemberAvatar'
import { Pill, StatCard } from '../../components/admin/ui'
import { PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { useAdminMembers } from '../../hooks/useAdminMembers'
import { usePaidThrough, useRecordPayment, useSendDuesReminder, useUndoLastPayment } from '../../hooks/useAdminPayments'
import { useClub } from '../../hooks/useClub'
import { localISODate } from '../../lib/date'

function formatEur(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`
}

function daysBetween(fromIso: string, to: Date): number {
  return Math.floor((to.getTime() - new Date(`${fromIso}T00:00:00`).getTime()) / 86_400_000)
}

// Deliberately simple: red row = not paid, one green button to mark the month
// paid (cash), a small undo for mistakes. Three months behind gets a flag so
// the coach can check whether the student has quit.
export function Payments() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: members } = useAdminMembers(club?.id)
  const { data: paidThrough } = usePaidThrough(club?.id)
  const recordPayment = useRecordPayment(club?.id)
  const undoPayment = useUndoLastPayment(club?.id)
  const sendReminder = useSendDuesReminder(club?.id)
  const [reminderNote, setReminderNote] = useState<Record<string, string>>({})

  const now = new Date()
  const today = localISODate(now)
  const students = (members ?? []).filter((m) => m.role === 'student' && m.status !== 'left')
  const isPaid = (id: string) => (paidThrough?.get(id) ?? '') >= today
  const paidUp = students.filter((m) => isPaid(m.id)).length
  const expected = students.reduce((sum, m) => sum + (m.monthly_fee_cents ?? 0), 0)
  // Unpaid first, so the list reads as a to-do.
  const sorted = [...students].sort((a, b) => Number(isPaid(a.id)) - Number(isPaid(b.id)))

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="金" title={t('admin.payments.title')} tone="bg-kin" />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label={t('admin.payments.paidUp')} value={`${paidUp} / ${students.length}`} kanji="済" tone="bg-jade" />
        <StatCard label={t('admin.payments.behind')} value={students.length - paidUp} kanji="未" tone="bg-aka" />
        <div className="col-span-2 sm:col-span-1">
          <StatCard label={t('admin.payments.expected')} value={formatEur(expected)} kanji="月" tone="bg-kin" />
        </div>
      </div>

      <Stagger className="mt-5 space-y-2">
        {sorted.map((m) => {
          const through = paidThrough?.get(m.id)
          const paid = isPaid(m.id)
          // Behind for 3+ months: last paid period ended over ~90 days ago.
          const longBehind = !paid && daysBetween(through ?? m.joined_at ?? localISODate(now), now) >= 90
          return (
            <StaggerItem key={m.id}>
              <motion.div
                layout
                className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 pl-4 transition-colors ${
                  paid ? 'border-jade/25 bg-shiro/95' : 'border-aka/35 bg-aka/6'
                }`}
              >
                <MemberAvatar name={m.full_name} photoPath={m.photo_path} tone={paid ? 'bg-jade' : 'bg-aka'} className="h-11 w-11 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{m.full_name}</p>
                  <p className={`text-xs ${paid ? 'text-jade' : 'text-aka-text'}`}>
                    {paid
                      ? t('admin.payments.paidUntil', { date: through })
                      : through
                        ? t('admin.payments.unpaidSince', { date: through })
                        : t('admin.payments.neverPaid')}
                    {m.monthly_fee_cents != null && <span className="text-muted"> · {formatEur(m.monthly_fee_cents)}</span>}
                  </p>
                  {longBehind && (
                    <span className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Pill tone="kin">{t('admin.payments.longBehind')}</Pill>
                      <button
                        type="button"
                        disabled={sendReminder.isPending || !(m.guardian_email || m.email)}
                        title={!(m.guardian_email || m.email) ? t('admin.payments.reminder.no_email') : undefined}
                        onClick={async () => {
                          const r = await sendReminder.mutateAsync(m.id)
                          setReminderNote((n) => ({ ...n, [m.id]: 'sent' in r ? t('admin.payments.reminder.sent', { to: r.to }) : t(`admin.payments.reminder.${r.error}`, { defaultValue: t('admin.payments.reminder.send_failed') }) }))
                        }}
                        className="rounded-full border border-ink/15 bg-shiro px-3 py-1 font-display text-[11px] uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text disabled:opacity-40"
                      >
                        ✉ {t('admin.payments.reminder.button')}
                      </button>
                      {(reminderNote[m.id] || m.last_reminder_at) && (
                        <span className="text-[11px] text-muted">
                          {reminderNote[m.id] ?? t('admin.payments.reminder.last', { date: new Date(m.last_reminder_at as string).toLocaleDateString() })}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {paid ? (
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-jade/15 px-3 py-1.5 font-display text-[11px] uppercase tracking-wide text-jade">
                      ✓ {t('admin.payments.statusPaid')}
                    </span>
                    <button
                      type="button"
                      disabled={undoPayment.isPending}
                      title={t('admin.payments.undoHint')}
                      aria-label={t('admin.payments.undo')}
                      onClick={() => {
                        if (confirm(t('admin.payments.undoConfirm', { name: m.full_name }))) undoPayment.mutate(m.id)
                      }}
                      className="h-9 w-9 rounded-full border border-ink/15 text-muted transition-colors hover:border-aka-text hover:text-aka-text"
                    >
                      ↺
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={m.monthly_fee_cents == null || recordPayment.isPending}
                    title={m.monthly_fee_cents == null ? t('admin.payments.noFee') : undefined}
                    onClick={() =>
                      recordPayment.mutate({
                        memberId: m.id,
                        amountCents: m.monthly_fee_cents ?? 0,
                        method: 'cash',
                        paidThrough: through,
                      })
                    }
                    className="min-h-11 rounded-xl bg-jade px-5 font-display text-xs uppercase tracking-wide text-shiro shadow-[0_10px_20px_-12px_rgba(47,107,79,0.9)] transition-transform active:scale-95 disabled:opacity-40"
                  >
                    {t('admin.payments.markPaid')}
                  </button>
                )}
              </motion.div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </div>
  )
}
