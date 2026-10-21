// Chrome/Edge/Android fire `beforeinstallprompt` once, often before React has
// mounted, so it's caught here at startup and kept for the install button.
// Safari (iPhone/iPad) has no such event: there the button shows the
// Share -> "Add to Home Screen" steps instead.

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e as InstallPromptEvent
  notify()
})
window.addEventListener('appinstalled', () => {
  deferred = null
  notify()
})

export function subscribeInstall(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const canPromptInstall = () => deferred !== null

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  await deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
  notify()
  return outcome === 'accepted'
}

export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export const isMobile = () => /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent) || isIOS()

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
