import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

  return (
    <div className="px-6 py-6">
      <h1 className="font-display text-xl uppercase tracking-wide text-ink">
        {t('admin.payments.title')}
      </h1>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">{t('admin.payments.name')}</th>
              <th className="p-3">{t('admin.payments.fee')}</th>
              <th className="p-3">{t('admin.payments.paidThrough')}</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((m) => {
              const through = paidThrough?.get(m.id)
              const overdue = !through || through < today
              const method = methodByMember[m.id] ?? 'cash'
              return (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="p-3 text-ink">{m.full_name}</td>
                  <td className="p-3 text-muted">
                    {m.monthly_fee_cents != null ? formatEur(m.monthly_fee_cents) : '-'}
                  </td>
                  <td className="p-3">
                    <span className={overdue ? 'text-aka-text' : 'text-ink'}>
                      {through ?? t('admin.payments.neverPaid')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={method}
                        onChange={(e) =>
                          setMethodByMember((prev) => ({
                            ...prev,
                            [m.id]: e.target.value as (typeof METHODS)[number],
                          }))
                        }
                        className="min-h-9 rounded-md border border-line bg-ink px-2 text-xs text-text outline-none focus:border-aka-text"
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
                        className="min-h-9 rounded-md border border-line px-3 text-xs uppercase tracking-wide text-muted disabled:opacity-60"
                      >
                        {t('admin.payments.recordPayment')}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
