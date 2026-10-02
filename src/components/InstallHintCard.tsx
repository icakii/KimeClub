import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

const DISMISS_KEY = 'kime-install-hint-dismissed'

function shouldShowInitially(): boolean {
  if (isStandalone()) return false
  try {
    return localStorage.getItem(DISMISS_KEY) !== '1'
  } catch {
    return true
  }
}

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
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="font-display text-sm uppercase tracking-wide text-ink">
        {t('studentHome.install.title')}
      </p>
      <p className="mt-2 text-sm text-muted">
        {isIOS() ? t('studentHome.install.ios') : t('studentHome.install.android')}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 min-h-11 rounded-md border border-line px-4 font-display text-xs uppercase tracking-wide text-muted"
      >
        {t('studentHome.install.dismiss')}
      </button>
    </div>
  )
}
