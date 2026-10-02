import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBelts } from '../../hooks/useBelts'
import { useClub } from '../../hooks/useClub'
import { useAdminMembers } from '../../hooks/useAdminMembers'

const STATUSES = ['active', 'trial', 'paused', 'left'] as const

export function Members() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: members, isLoading } = useAdminMembers(club?.id)
  const { data: belts } = useBelts(club?.id)

  const [search, setSearch] = useState('')
  const [beltFilter, setBeltFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return (members ?? []).filter((m) => {
      if (search && !m.full_name.toLowerCase().includes(search.toLowerCase())) return false
      if (beltFilter && m.belt?.id !== beltFilter) return false
      if (statusFilter && m.status !== statusFilter) return false
      return true
    })
  }, [members, search, beltFilter, statusFilter])

  if (!club) return null

  return (
    <div className="px-6 py-6">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('admin.members.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.members.viewOnlyNote')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.members.searchPlaceholder')}
          className="min-h-11 flex-1 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
        />
        <select
          value={beltFilter}
          onChange={(e) => setBeltFilter(e.target.value)}
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
        >
          <option value="">{t('admin.members.allBelts')}</option>
          {belts?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name_bg}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
        >
          <option value="">{t('admin.members.allStatuses')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`admin.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {isLoading && <p className="p-6 text-center text-muted">...</p>}

        {filtered.map((m) => (
          <div key={m.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display uppercase tracking-wide text-ink">{m.full_name}</p>
                <p className="text-xs text-muted">{t(`admin.role.${m.role}`)}</p>
              </div>
              <div className="flex items-center gap-2">
                {m.belt && (
                  <span
                    className="rounded-full border border-line/60 px-3 py-1 text-xs font-display uppercase tracking-wide"
                    style={{ background: m.belt.color_hex, color: '#111114' }}
                  >
                    {i18n.resolvedLanguage === 'en' ? m.belt.name_en : m.belt.name_bg}
                  </span>
                )}
                <span className="text-xs uppercase tracking-wide text-muted">
                  {t(`admin.status.${m.status}`)}
                </span>
              </div>
            </div>

            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {t('admin.members.contact')}
                </p>
                <p className="text-ink">{m.email ?? '-'}</p>
                <p className="text-ink">{m.phone ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {t('admin.members.guardian')}
                </p>
                {m.guardian_first_name ? (
                  <>
                    <p className="text-ink">
                      {[m.guardian_first_name, m.guardian_last_name].filter(Boolean).join(' ')}
                    </p>
                    <p className="text-ink">{m.guardian_phone ?? '-'}</p>
                    {m.guardian_email && <p className="text-ink">{m.guardian_email}</p>}
                  </>
                ) : (
                  <p className="text-muted">-</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
