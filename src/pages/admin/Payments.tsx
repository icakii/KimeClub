import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initials, Pill, StatCard } from '../../components/admin/ui'
import { PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { useAdminMembers } from '../../hooks/useAdminMembers'
import { usePaidThrough, useRecordPayment } from '../../hooks/useAdminPayments'
import { useClub } from '../../hooks/useClub'

const METHODS = ['cash', 'card', 'bank', 'online'] as const

function formatEur(cents: number): string {
  return `${(cents / 100).toFixed(2)} EUR`
}

export function Payments() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: members } = useAdminMembers(club?.id)
  const { data: paidThrough } = usePaidThrough(club?.id)
  const recordPayment = useRecordPayment(club?.id)
  const [methodByMember, setMethodByMember] = useState<Record<string, (typeof METHODS)[number]>>(
    {},
  )

  const today = new Date().toISOString().slice(0, 10)
  const students = (members ?? []).filter((m) => m.role === 'student' && m.status !== 'left')
  const paidUp = students.filter((m) => (paidThrough?.get(m.id) ?? '') >= today).length
  const expected = students.reduce((sum, m) => sum + (m.monthly_fee_cents ?? 0), 0)

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="金" title={t('admin.payments.title')} tone="bg-kin" />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label={t('admin.payments.paidUp')}
          value={`${paidUp} / ${students.length}`}
          kanji="済"
          tone="bg-jade"
        />
        <StatCard label={t('admin.payments.behind')} value={students.length - paidUp} kanji="未" tone="bg-aka" />
        <div className="col-span-2 sm:col-span-1">
          <StatCard label={t('admin.payments.expected')} value={formatEur(expected)} kanji="月" tone="bg-kin" />
        </div>
      </div>

      <Stagger className="mt-5 space-y-2">
        {students.map((m) => {
          const through = paidThrough?.get(m.id)
          const current = !!through && through >= today
          const method = methodByMember[m.id] ?? 'cash'
          return (
            <StaggerItem key={m.id}>
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-shiro/95 p-3 pl-4 shadow-[0_16px_32px_-26px_rgba(31,27,22,0.55)]">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold text-shiro ${
                    current ? 'bg-jade' : 'bg-aka'
                  }`}
                >
                  {initials(m.full_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{m.full_name}</p>
                  <p className="text-xs text-muted">
                    {m.monthly_fee_cents != null
                      ? formatEur(m.monthly_fee_cents)
                      : t('admin.payments.noFee')}
                    {through && ` · ${t('admin.payments.throughDate', { date: through })}`}
                  </p>
                </div>
                <Pill tone={current ? 'jade' : through ? 'aka' : 'kin'}>
                  {current
                    ? t('admin.payments.statusPaid')
                    : through
                      ? t('admin.payments.statusOverdue')
                      : t('admin.payments.neverPaid')}
                </Pill>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <select
                    value={method}
                    onChange={(e) =>
                      setMethodByMember((prev) => ({
                        ...prev,
                        [m.id]: e.target.value as (typeof METHODS)[number],
                      }))
                    }
                    className="min-h-10 flex-1 rounded-xl border border-ink/15 bg-kuro px-2 text-xs text-ink outline-none focus:border-aka-text sm:flex-none"
                  >
                    {METHODS.map((meth) => (
                      <option key={meth} value={meth}>
                        {t(`admin.payments.methods.${meth}`)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={m.monthly_fee_cents == null || recordPayment.isPending}
                    onClick={() =>
                      recordPayment.mutate({
                        memberId: m.id,
                        amountCents: m.monthly_fee_cents ?? 0,
                        method,
                        paidThrough: through,
                      })
                    }
                    className="min-h-10 flex-1 rounded-xl bg-ink px-4 font-display text-[11px] uppercase tracking-wide text-shiro transition-transform active:scale-95 disabled:opacity-40 sm:flex-none"
                  >
                    {t('admin.payments.recordPayment')}
                  </button>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </div>
  )
}
