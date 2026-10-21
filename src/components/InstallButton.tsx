import { AnimatePresence, motion } from 'framer-motion'
import { useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { canPromptInstall, isIOS, isStandalone, promptInstall, subscribeInstall } from '../lib/install'
import { Emblem } from './landing/Emblem'

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="inline h-5 w-5 align-[-4px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="inline h-5 w-5 align-[-4px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  )
}

// "Add to phone": one tap on Android/Chrome (native install prompt), and a
// short step-by-step sheet on iPhone, where Safari only allows it by hand.
export function InstallButton({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const canPrompt = useSyncExternalStore(subscribeInstall, canPromptInstall)
  const [steps, setSteps] = useState(false)

  if (isStandalone()) return null

  async function onClick() {
    if (canPrompt) await promptInstall()
    else setSteps(true)
  }

  const ios = isIOS()

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`group flex min-h-14 w-full items-center gap-3 rounded-2xl bg-ink px-4 text-left text-shiro shadow-[0_14px_28px_-16px_rgba(31,27,22,0.9)] transition-transform active:scale-[0.98] ${className}`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-shiro">
          <Emblem className="h-8 w-8" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm uppercase tracking-wide">{t('install.button')}</span>
          <span className="block text-xs text-shiro/60">{t('install.sub')}</span>
        </span>
        <span className="text-xl transition-transform group-hover:translate-y-0.5" aria-hidden="true">
          ↓
        </span>
      </button>

      <AnimatePresence>
        {steps && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:px-6"
            onClick={() => setSteps(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-3xl bg-shiro p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-2xl sm:rounded-3xl"
            >
              <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">{t('install.title')}</p>
              <ol className="mt-4 space-y-3">
                {(ios
                  ? [
                      <>
                        {t('install.ios1')} <ShareIcon />
                      </>,
                      <>
                        {t('install.ios2')} <PlusSquareIcon />
                      </>,
                      <>{t('install.ios3')}</>,
                    ]
                  : [<>{t('install.other1')}</>, <>{t('install.other2')}</>, <>{t('install.ios3')}</>]
                ).map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.12 }}
                    className="flex items-center gap-3 rounded-2xl bg-kuro/70 p-3 text-ink"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aka font-display text-sm text-shiro">
                      {i + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </motion.li>
                ))}
              </ol>
              {ios && <p className="mt-3 text-xs text-muted">{t('install.iosSafari')}</p>}
              <button
                type="button"
                onClick={() => setSteps(false)}
                className="mt-5 min-h-12 w-full rounded-xl bg-ink font-display text-sm uppercase tracking-wide text-shiro"
              >
                {t('install.ok')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
