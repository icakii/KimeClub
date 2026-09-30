import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function OfflineBanner() {
  const { t } = useTranslation()
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="bg-aka px-4 py-2 text-center font-display text-xs uppercase tracking-wide text-shiro">
      {t('offline.banner')}
    </div>
  )
}
