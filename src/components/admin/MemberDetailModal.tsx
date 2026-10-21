import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminMember } from '../../hooks/useAdminMembers'
import { useAddGrade, useDeleteGrade, useMemberGrades } from '../../hooks/useGrades'
import { beltLabel } from '../../lib/belts'
import { Stars } from '../Stars'
import { MemberAvatar } from './MemberAvatar'

const labelClass = 'text-[10px] font-semibold uppercase tracking-[0.2em] text-muted'

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <p className={labelClass}>{label}</p>
      <p className="truncate text-ink">{value || '-'}</p>
    </div>
  )
}

// Read-only member card for owners and coaches. Every detail here is entered
// by us from the Hub; the only thing a coach adds is a star grade, and only
// when the club has that option.
export function MemberDetailModal({
  clubId,
  member,
  gradesEnabled,
  onClose,
}: {
  clubId: string
  member: AdminMember
  gradesEnabled: boolean
  onClose: () => void
}) {
  const { t, i18n } = useTranslation()
  const { data: grades } = useMemberGrades(gradesEnabled ? member.id : undefined)
  const addGrade = useAddGrade(clubId)
  const deleteGrade = useDeleteGrade(clubId)
  const [stars, setStars] = useState(0)
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const age = member.birth_year ? new Date().getFullYear() - member.birth_year : null
  const average = grades && grades.length > 0 ? grades.reduce((s, g) => s + g.stars, 0) / grades.length : null

  async function onGrade(e: FormEvent) {
    e.preventDefault()
    if (!stars) return
    setError(false)
    try {
      await addGrade.mutateAsync({ memberId: member.id, stars, note })
      setStars(0)
      setNote('')
    } catch {
      setError(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 sm:items-center sm:px-6"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-shiro p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center gap-4">
          <MemberAvatar name={member.full_name} photoPath={member.photo_path} className="h-20 w-20 text-xl" />
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold uppercase tracking-wide text-ink">{member.full_name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {member.belt ? beltLabel(member.belt, i18n.resolvedLanguage) : t(`admin.role.${member.role}`)}
            </p>
            {average != null && (
              <div className="mt-1 flex items-center gap-2">
                <Stars value={average} size="h-4 w-4" />
                <span className="text-xs text-muted">{average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-kuro/70 p-4 text-sm">
          <Field label={t('admin.detail.age')} value={age != null ? String(age) : null} />
          <Field label={t('admin.detail.height')} value={member.height_cm ? `${member.height_cm} cm` : null} />
          <Field label={t('admin.detail.weight')} value={member.weight_kg ? `${member.weight_kg} kg` : null} />
        </div>

        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-2">
            <p className="font-display text-sm uppercase tracking-wide text-ink">{t('admin.members.contact')}</p>
            <Field label={t('admin.detail.phone')} value={member.phone} />
            <Field label={t('admin.detail.email')} value={member.email} />
          </div>
          <div className="space-y-2">
            <p className="font-display text-sm uppercase tracking-wide text-ink">{t('admin.members.guardian')}</p>
            <Field
              label={t('admin.detail.name')}
              value={[member.guardian_first_name, member.guardian_last_name].filter(Boolean).join(' ')}
            />
            <Field label={t('admin.detail.phone')} value={member.guardian_phone} />
            <Field label={t('admin.detail.email')} value={member.guardian_email} />
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-2">{t('admin.detail.managedNote')}</p>

        {gradesEnabled && member.role === 'student' && (
          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="font-display text-sm uppercase tracking-wide text-ink">{t('admin.grades.title')}</p>
            <form onSubmit={onGrade} className="mt-3 rounded-2xl border border-kin/40 bg-kin/10 p-4">
              <p className={labelClass}>{t('admin.grades.give')}</p>
              <div className="mt-2">
                <Stars value={stars} onChange={setStars} size="h-8 w-8" />
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                placeholder={t('admin.grades.notePlaceholder')}
                className="mt-3 min-h-11 w-full rounded-xl border border-ink/15 bg-shiro px-3 text-ink outline-none focus:border-aka-text"
              />
              {error && <p className="mt-2 text-sm text-aka-text">{t('admin.grades.error')}</p>}
              <button
                type="submit"
                disabled={!stars || addGrade.isPending}
                className="mt-3 min-h-11 w-full rounded-xl bg-ink font-display text-sm uppercase tracking-wide text-shiro transition-colors hover:bg-aka disabled:opacity-40"
              >
                {addGrade.isPending ? '...' : t('admin.grades.save')}
              </button>
            </form>

            <ul className="mt-3 space-y-2">
              <AnimatePresence initial={false}>
                {grades?.map((g) => (
                  <motion.li
                    key={g.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 rounded-xl border border-ink/10 px-3 py-2"
                  >
                    <Stars value={g.stars} size="h-4 w-4" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted">{new Date(g.given_on).toLocaleDateString(i18n.resolvedLanguage)}</p>
                      {g.note && <p className="truncate text-sm text-ink">{g.note}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteGrade.mutate(g)}
                      className="shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:text-aka-text"
                      aria-label={t('admin.grades.delete')}
                    >
                      ✕
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {grades?.length === 0 && <li className="text-sm text-muted">{t('admin.grades.none')}</li>}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 min-h-12 w-full rounded-xl border border-ink/15 font-display text-sm uppercase tracking-wide text-muted"
        >
          {t('admin.detail.close')}
        </button>
      </motion.div>
    </motion.div>
  )
}
