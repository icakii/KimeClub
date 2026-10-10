import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useUpdateMemberContact,
  useUploadMemberPhoto,
  type AdminMember,
  type MemberContact,
} from '../../hooks/useAdminMembers'
import { MemberAvatar } from './MemberAvatar'

const fieldClass =
  'mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-kuro px-3 text-ink outline-none transition-colors focus:border-aka-text'
const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted'

// Owners and coaches edit contact details, parent info and the photo.
// Name, belt, group, fee and status are not here on purpose (Hub only).
export function EditMemberModal({
  clubId,
  member,
  onClose,
}: {
  clubId: string
  member: AdminMember
  onClose: () => void
}) {
  const { t } = useTranslation()
  const updateContact = useUpdateMemberContact(clubId)
  const uploadPhoto = useUploadMemberPhoto(clubId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<MemberContact>({
    email: member.email ?? '',
    phone: member.phone ?? '',
    guardian_first_name: member.guardian_first_name ?? '',
    guardian_last_name: member.guardian_last_name ?? '',
    guardian_phone: member.guardian_phone ?? '',
    guardian_email: member.guardian_email ?? '',
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key: keyof MemberContact) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await updateContact.mutateAsync({ memberId: member.id, contact: form })
      onClose()
    } catch {
      setError(t('admin.edit.error'))
    }
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return
    setError(null)
    try {
      await uploadPhoto.mutateAsync({ memberId: member.id, file, oldPath: member.photo_path })
    } catch {
      setError(t('admin.edit.photoError'))
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
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative shrink-0"
            aria-label={t('admin.edit.changePhoto')}
          >
            <MemberAvatar name={member.full_name} photoPath={member.photo_path} className="h-20 w-20 text-xl" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/55 text-[10px] font-semibold uppercase tracking-wide text-shiro opacity-0 transition-opacity group-hover:opacity-100">
              {uploadPhoto.isPending ? '...' : t('admin.edit.changePhoto')}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0])}
          />
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold uppercase tracking-wide text-ink">
              {member.full_name}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1 font-display text-xs uppercase tracking-wide text-aka-text"
            >
              {uploadPhoto.isPending ? t('admin.edit.uploading') : t('admin.edit.changePhoto')}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-2 font-display text-sm uppercase tracking-wide text-ink">
              {t('admin.members.contact')}
            </legend>
            <label>
              <span className={labelClass}>{t('admin.edit.email')}</span>
              <input type="email" maxLength={200} value={form.email} onChange={set('email')} className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{t('admin.edit.phone')}</span>
              <input type="tel" maxLength={40} value={form.phone} onChange={set('phone')} className={fieldClass} />
            </label>
          </fieldset>

          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-2 font-display text-sm uppercase tracking-wide text-ink">
              {t('admin.members.guardian')}
            </legend>
            <label>
              <span className={labelClass}>{t('admin.edit.firstName')}</span>
              <input maxLength={80} value={form.guardian_first_name} onChange={set('guardian_first_name')} className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{t('admin.edit.lastName')}</span>
              <input maxLength={80} value={form.guardian_last_name} onChange={set('guardian_last_name')} className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{t('admin.edit.phone')}</span>
              <input type="tel" maxLength={40} value={form.guardian_phone} onChange={set('guardian_phone')} className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{t('admin.edit.email')}</span>
              <input type="email" maxLength={200} value={form.guardian_email} onChange={set('guardian_email')} className={fieldClass} />
            </label>
          </fieldset>

          {error && <p className="rounded-xl bg-aka/10 px-4 py-3 text-sm text-aka-text">{error}</p>}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 rounded-xl border border-ink/15 font-display text-sm uppercase tracking-wide text-muted"
            >
              {t('admin.edit.cancel')}
            </button>
            <button
              type="submit"
              disabled={updateContact.isPending}
              className="min-h-12 rounded-xl bg-aka font-display text-sm uppercase tracking-wide text-shiro shadow-[0_12px_24px_-12px_rgba(194,54,31,0.9)] disabled:opacity-60"
            >
              {updateContact.isPending ? '...' : t('admin.edit.save')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
