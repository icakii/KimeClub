import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EditMemberModal } from '../../components/admin/EditMemberModal'
import { MemberAvatar } from '../../components/admin/MemberAvatar'
import { Pill, StatCard } from '../../components/admin/ui'
import { PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { useAdminMembers, type AdminMember } from '../../hooks/useAdminMembers'
import { useBelts } from '../../hooks/useBelts'
import { beltLabel } from '../../lib/belts'
import { useClub } from '../../hooks/useClub'

const STATUSES = ['active', 'trial', 'paused', 'left'] as const

const STATUS_TONE: Record<AdminMember['status'], 'jade' | 'kin' | 'aka' | 'muted'> = {
  active: 'jade',
  trial: 'kin',
  paused: 'aka',
  left: 'muted',
}

const ROLE_AVATAR: Record<AdminMember['role'], string> = {
  owner: 'bg-ink',
  coach: 'bg-ai',
  student: 'bg-aka',
}

const fieldClass =
  'min-h-11 rounded-xl border border-ink/15 bg-shiro/95 px-3 text-ink outline-none transition-colors focus:border-aka-text'

export function Members() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: members, isLoading } = useAdminMembers(club?.id)
  const { data: belts } = useBelts(club?.id)

  const [search, setSearch] = useState('')
  const [beltFilter, setBeltFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState<AdminMember | null>(null)

  const filtered = useMemo(() => {
    return (members ?? []).filter((m) => {
      if (search && !m.full_name.toLowerCase().includes(search.toLowerCase())) return false
      if (beltFilter && m.belt?.id !== beltFilter) return false
      if (statusFilter && m.status !== statusFilter) return false
      return true
    })
  }, [members, search, beltFilter, statusFilter])

  if (!club) return null

  const count = (status: AdminMember['status']) => (members ?? []).filter((m) => m.status === status).length

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="人" title={t('admin.members.title')} tone="bg-ai" />
      <p className="mt-2 text-sm text-muted">{t('admin.members.viewOnlyNote')}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatCard label={t('admin.status.active')} value={count('active')} kanji="活" tone="bg-jade" />
        <StatCard label={t('admin.status.trial')} value={count('trial')} kanji="試" tone="bg-kin" />
        <StatCard label={t('admin.status.paused')} value={count('paused')} kanji="休" tone="bg-aka" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.members.searchPlaceholder')}
          className={`${fieldClass} min-w-48 flex-1`}
        />
        <select value={beltFilter} onChange={(e) => setBeltFilter(e.target.value)} className={fieldClass}>
          <option value="">{t('admin.members.allBelts')}</option>
          {belts?.map((b) => (
            <option key={b.id} value={b.id}>
              {beltLabel(b, i18n.resolvedLanguage)}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={fieldClass}>
          <option value="">{t('admin.members.allStatuses')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`admin.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="p-6 text-center text-muted">...</p>}

      <Stagger key={`${search}|${beltFilter}|${statusFilter}`} className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((m) => (
          <StaggerItem key={m.id}>
            <div className="h-full rounded-2xl border border-ink/10 bg-shiro/95 p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <MemberAvatar name={m.full_name} photoPath={m.photo_path} tone={ROLE_AVATAR[m.role]} />
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold uppercase tracking-wide text-ink">
                      {m.full_name}
                    </p>
                    <p className="text-xs text-muted">{t(`admin.role.${m.role}`)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Pill tone={STATUS_TONE[m.status]}>{t(`admin.status.${m.status}`)}</Pill>
                  <button
                    type="button"
                    onClick={() => setEditing(m)}
                    className="rounded-full border border-ink/15 px-3 py-1 font-display text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-aka-text hover:text-aka-text"
                  >
                    ✎ {t('admin.edit.button')}
                  </button>
                </div>
              </div>

              {m.belt && (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="h-2.5 w-10 rounded-full ring-1 ring-ink/15"
                    style={{
                      background: m.belt.color2_hex
                        ? `linear-gradient(${m.belt.color_hex} 38%, ${m.belt.color2_hex} 38% 62%, ${m.belt.color_hex} 62%)`
                        : m.belt.color_hex,
                    }}
                  />
                  <span className="text-xs uppercase tracking-wide text-muted">
                    {beltLabel(m.belt, i18n.resolvedLanguage)}
                  </span>
                </div>
              )}

              <div className="mt-3 grid gap-3 border-t border-ink/10 pt-3 text-sm sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {t('admin.members.contact')}
                  </p>
                  <p className="truncate text-ink">{m.email ?? '-'}</p>
                  <p className="text-ink">{m.phone ?? '-'}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {t('admin.members.guardian')}
                  </p>
                  {m.guardian_first_name ? (
                    <>
                      <p className="text-ink">
                        {[m.guardian_first_name, m.guardian_last_name].filter(Boolean).join(' ')}
                      </p>
                      <p className="text-ink">{m.guardian_phone ?? '-'}</p>
                      {m.guardian_email && <p className="truncate text-ink">{m.guardian_email}</p>}
                    </>
                  ) : (
                    <p className="text-muted">-</p>
                  )}
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {editing && <EditMemberModal clubId={club.id} member={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
