import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { useBelts } from '../../hooks/useBelts'
import { useCreateMemberAccount } from '../../hooks/useAdminMembers'

function randomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function AddMemberModal({
  clubId,
  onClose,
}: {
  clubId: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { data: belts } = useBelts(clubId)
  const createAccount = useCreateMemberAccount(clubId)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(randomPassword)
  const [beltId, setBeltId] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [phone, setPhone] = useState('')
  const [guardianConsent, setGuardianConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createAccount.mutateAsync({
        club_id: clubId,
        full_name: fullName,
        email,
        password,
        belt_id: beltId || undefined,
        birth_year: birthYear ? Number(birthYear) : undefined,
        phone: phone || undefined,
        guardian_consent: guardianConsent,
      })
      setCreated({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.addMember.error'))
    }
  }

  if (created) {
    return (
      <Modal title={t('admin.addMember.successTitle')} closeLabel={t('admin.addMember.done')} onClose={onClose}>
        <p>{t('admin.addMember.successBody')}</p>
        <div className="mt-4 space-y-2 rounded-md border border-line bg-kuro p-3 font-mono text-xs text-shiro">
          <p>{created.email}</p>
          <p>{created.password}</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title={t('admin.addMember.title')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div>
          <label htmlFor="full_name" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.fullName')}
          </label>
          <input
            id="full_name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.email')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.password')}
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-md border border-line bg-kuro px-3 font-mono text-shiro outline-none focus:border-aka-text"
            />
            <button
              type="button"
              onClick={() => setPassword(randomPassword())}
              className="min-h-11 shrink-0 rounded-md border border-line px-3 text-xs uppercase tracking-wide text-muted"
            >
              {t('admin.addMember.regenerate')}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="belt" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.belt')}
          </label>
          <select
            id="belt"
            value={beltId}
            onChange={(e) => setBeltId(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          >
            <option value="">-</option>
            {belts?.map((belt) => (
              <option key={belt.id} value={belt.id}>
                {belt.name_bg}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="birth_year" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.birthYear')}
          </label>
          <input
            id="birth_year"
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.phone')}
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={guardianConsent}
            onChange={(e) => setGuardianConsent(e.target.checked)}
            className="h-5 w-5"
          />
          {t('admin.addMember.guardianConsent')}
        </label>

        {error && <p className="text-sm text-aka-text">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-md border border-line font-display text-sm uppercase tracking-wide text-muted"
          >
            {t('admin.cancel')}
          </button>
          <button
            type="submit"
            disabled={createAccount.isPending}
            className="min-h-11 flex-1 rounded-md bg-aka font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60"
          >
            {createAccount.isPending ? t('admin.saving') : t('admin.addMember.submit')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
