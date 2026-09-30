import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ResetPassword() {
  const { t } = useTranslation()
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await updatePassword(password)
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    navigate('/app', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('auth.resetTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-muted">
              {t('auth.resetNewPassword')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-md border border-line bg-surface px-3 text-shiro outline-none focus:border-aka-text"
            />
          </div>

          {error && <p className="text-sm text-aka-text">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 w-full rounded-md bg-aka font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60"
          >
            {submitting ? t('auth.submitting') : t('auth.resetSubmit')}
          </button>
        </form>
      </div>
    </div>
  )
}
