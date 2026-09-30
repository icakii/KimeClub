import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ForgotPassword() {
  const { t } = useTranslation()
  const { sendPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await sendPasswordReset(email)
    setSubmitting(false)
    if (error) {
      setError(t('auth.forgotError'))
      return
    }
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('auth.forgotTitle')}
        </h1>

        {sent ? (
          <p className="mt-6 text-center text-sm text-muted">{t('auth.forgotSent')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-muted">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-md border border-line bg-surface px-3 text-shiro outline-none focus:border-aka-text"
              />
            </div>

            {error && <p className="text-sm text-aka-text">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 w-full rounded-md bg-aka font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60"
            >
              {submitting ? t('auth.submitting') : t('auth.forgotSubmit')}
            </button>
          </form>
        )}

        <Link to="/login" className="mt-6 block text-center text-sm text-aka-text hover:underline">
          ← {t('auth.title')}
        </Link>
      </div>
    </div>
  )
}
