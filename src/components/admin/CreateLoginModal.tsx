import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { useCreateMemberAccount, type AdminMember } from '../../hooks/useAdminMembers'

function randomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let out = ''
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function CreateLoginModal({
  clubId,
  member,
  onClose,
}: {
  clubId: string
  member: AdminMember
  onClose: () => void
}) {
  const { t } = useTranslation()
  const createAccount = useCreateMemberAccount(clubId)

  const [email, setEmail] = useState(member.email ?? '')
  const [password, setPassword] = useState(randomPassword)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createAccount.mutateAsync({ club_id: clubId, member_id: member.id, email, password })
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
    <Modal title={t('admin.createLogin.title', { name: member.full_name })} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div>
          <label htmlFor="cl-email" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.email')}
          </label>
          <input
            id="cl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-line bg-kuro px-3 text-shiro outline-none focus:border-aka-text"
          />
        </div>

        <div>
          <label htmlFor="cl-password" className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.addMember.password')}
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="cl-password"
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
