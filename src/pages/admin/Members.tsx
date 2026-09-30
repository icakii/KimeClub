import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddMemberModal } from '../../components/admin/AddMemberModal'
import { CreateLoginModal } from '../../components/admin/CreateLoginModal'
import { useBelts } from '../../hooks/useBelts'
import { useClub } from '../../hooks/useClub'
import { useAdminMembers, useUpdateMember, type AdminMember } from '../../hooks/useAdminMembers'

const STATUSES = ['active', 'trial', 'paused', 'left'] as const

export function Members() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: members, isLoading } = useAdminMembers(club?.id)
  const { data: belts } = useBelts(club?.id)
  const updateMember = useUpdateMember(club?.id)

  const [search, setSearch] = useState('')
  const [beltFilter, setBeltFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loginTarget, setLoginTarget] = useState<AdminMember | null>(null)

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl uppercase tracking-wide">{t('admin.members.title')}</h1>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-11 rounded-md bg-aka px-4 font-display text-sm uppercase tracking-wide text-shiro"
        >
          {t('admin.members.add')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.members.searchPlaceholder')}
          className="min-h-11 flex-1 rounded-md border border-line bg-surface px-3 text-shiro outline-none focus:border-aka-text"
        />
        <select
          value={beltFilter}
          onChange={(e) => setBeltFilter(e.target.value)}
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-shiro outline-none focus:border-aka-text"
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
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-shiro outline-none focus:border-aka-text"
        >
          <option value="">{t('admin.members.allStatuses')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`admin.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-3">{t('admin.members.name')}</th>
              <th className="p-3">{t('admin.members.belt')}</th>
              <th className="p-3">{t('admin.members.status')}</th>
              <th className="p-3">{t('admin.members.login')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
                  ...
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <p className="text-shiro">{m.full_name}</p>
                  <p className="text-xs text-muted">{t(`admin.role.${m.role}`)}</p>
                </td>
                <td className="p-3">
                  <select
                    value={m.belt?.id ?? ''}
                    onChange={(e) =>
                      updateMember.mutate({
                        memberId: m.id,
                        updates: { belt_id: e.target.value || null },
                      })
                    }
                    className="min-h-11 rounded-md border border-line bg-surface px-2 text-shiro"
                  >
                    <option value="">-</option>
                    {belts?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name_bg}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={m.status}
                    onChange={(e) =>
                      updateMember.mutate({
                        memberId: m.id,
                        updates: { status: e.target.value as AdminMember['status'] },
                      })
                    }
                    className="min-h-11 rounded-md border border-line bg-surface px-2 text-shiro"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {t(`admin.status.${s}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  {m.user_id ? (
                    <span className="text-xs text-muted">{t('admin.members.hasLogin')}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLoginTarget(m)}
                      className="min-h-11 rounded-md border border-line px-3 text-xs uppercase tracking-wide text-aka-text"
                    >
                      {t('admin.members.createLogin')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddMemberModal clubId={club.id} onClose={() => setShowAddModal(false)} />}
      {loginTarget && (
        <CreateLoginModal clubId={club.id} member={loginTarget} onClose={() => setLoginTarget(null)} />
      )}
    </div>
  )
}
