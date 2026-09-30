import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { t } = useTranslation()
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  if (session) {
    const from = (location.state as { from?: string })?.from ?? '/app'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(t('auth.error'))
      return
    }
    navigate('/app', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-2xl uppercase tracking-wide">
          {t('auth.title')}
        </h1>

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

          <div>
            <label htmlFor="password" className="block text-sm text-muted">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
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
            {submitting ? t('auth.submitting') : t('auth.submit')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t('auth.noAccount')}{' '}
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="text-aka-text hover:underline"
          >
            {t('auth.noAccountLink')}
          </button>
        </p>
      </div>

      {showContactModal && (
        <Modal
          title={t('auth.modalTitle')}
          closeLabel={t('auth.modalClose')}
          onClose={() => setShowContactModal(false)}
        >
          {t('auth.modalBody')}
        </Modal>
      )}
    </div>
  )
}
