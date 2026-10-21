import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isStandalone } from '../lib/install'
import { InstallButton } from './InstallButton'

const DISMISS_KEY = 'kime-install-hint-dismissed'

function shouldShowInitially(): boolean {
  if (isStandalone()) return false
  try {
    return localStorage.getItem(DISMISS_KEY) !== '1'
  } catch {
    return true
  }
}

// First-visit nudge on the home screen. The same button stays on the
// profile page after this card is dismissed.
export function InstallHintCard() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(shouldShowInitially)

  if (!visible) return null

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-2xl border border-jade/30 bg-shiro/95 p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm uppercase tracking-wide text-ink">{t('studentHome.install.title')}</p>
          <p className="mt-1 text-sm text-muted">{t('install.why')}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full px-2 py-1 text-sm text-muted hover:text-ink"
          aria-label={t('studentHome.install.dismiss')}
        >
          ✕
        </button>
      </div>
      <InstallButton className="mt-3" />
    </div>
  )
}
