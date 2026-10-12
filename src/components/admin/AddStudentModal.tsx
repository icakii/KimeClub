import { motion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useBelts } from '../../hooks/useBelts'
import { useAddStudent, useGroups } from '../../hooks/useClubAdmin'
import { beltLabel } from '../../lib/belts'

const fieldClass =
  'mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-kuro px-3 text-ink outline-none transition-colors focus:border-aka-text'
const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted'

// "Клуб" plan only: the club adds its own students. Creating their app
// login is still done by Tatami.
export function AddStudentModal({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const { data: belts } = useBelts(clubId)
  const { data: groups } = useGroups(clubId)
  const addStudent = useAddStudent(clubId)
  const [error, setError] = useState<string | null>(null)
  const [f, setF] = useState({
    full_name: '',
    birth_year: '',
    group_id: '',
    belt_id: '',
    fee: '',
    phone: '',
    email: '',
    guardian_first_name: '',
    guardian_phone: '',
  })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await addStudent.mutateAsync({
        full_name: f.full_name.trim(),
        birth_year: f.birth_year ? Number(f.birth_year) : null,
        group_id: f.group_id || null,
        belt_id: f.belt_id || (belts?.[0]?.id ?? null),
        monthly_fee_cents: f.fee ? Math.round(Number(f.fee) * 100) : null,
        phone: f.phone.trim() || null,
        email: f.email.trim() || null,
        guardian_first_name: f.guardian_first_name.trim() || null,
        guardian_phone: f.guardian_phone.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error && err.message.includes('limit') ? t('admin.add.limit') : t('admin.edit.error'))
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
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">{t('admin.add.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('admin.add.note')}</p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>{t('admin.add.name')}</span>
            <input required maxLength={120} value={f.full_name} onChange={set('full_name')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.add.birthYear')}</span>
            <input type="number" min={1940} max={2030} value={f.birth_year} onChange={set('birth_year')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.edit.fee')}</span>
            <input type="number" min={0} step="0.01" value={f.fee} onChange={set('fee')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.edit.group')}</span>
            <select value={f.group_id} onChange={set('group_id')} className={fieldClass}>
              <option value="">-</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>{t('admin.edit.belt')}</span>
            <select value={f.belt_id} onChange={set('belt_id')} className={fieldClass}>
              {belts?.map((b) => (
                <option key={b.id} value={b.id}>
                  {beltLabel(b, i18n.resolvedLanguage)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>{t('admin.edit.phone')}</span>
            <input type="tel" maxLength={40} value={f.phone} onChange={set('phone')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.edit.email')}</span>
            <input type="email" maxLength={200} value={f.email} onChange={set('email')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.add.parentName')}</span>
            <input maxLength={80} value={f.guardian_first_name} onChange={set('guardian_first_name')} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>{t('admin.add.parentPhone')}</span>
            <input type="tel" maxLength={40} value={f.guardian_phone} onChange={set('guardian_phone')} className={fieldClass} />
          </label>

          {error && <p className="rounded-xl bg-aka/10 px-4 py-3 text-sm text-aka-text sm:col-span-2">{error}</p>}

          <div className="grid grid-cols-2 gap-3 pt-2 sm:col-span-2">
            <button type="button" onClick={onClose} className="min-h-12 rounded-xl border border-ink/15 font-display text-sm uppercase tracking-wide text-muted">
              {t('admin.edit.cancel')}
            </button>
            <button
              type="submit"
              disabled={addStudent.isPending}
              className="min-h-12 rounded-xl bg-aka font-display text-sm uppercase tracking-wide text-shiro shadow-[0_12px_24px_-12px_rgba(194,54,31,0.9)] disabled:opacity-60"
            >
              {addStudent.isPending ? '...' : t('admin.add.submit')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
