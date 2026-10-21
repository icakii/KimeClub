import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { KanjiBackdrop } from '../components/KanjiBackdrop'
import { Emblem } from '../components/landing/Emblem'
import { useCheckIn, type CheckinError } from '../hooks/useCheckin'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Where the hall QR code leads. Logged in (the route guard sends you to the
// login and back), this marks you present for the class that's on now.
export function CheckIn() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const checkIn = useCheckIn()
  const reduced = useReducedMotion()
  const fired = useRef(false)

  useEffect(() => {
    // Once per visit, even under StrictMode's double effect.
    if (!token || fired.current) return
    fired.current = true
    checkIn.mutate(token)
  }, [token, checkIn])

  const ok = checkIn.data
  const err = checkIn.error ? (checkIn.error.message as CheckinError) : null

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <KanjiBackdrop parallax={0.2} baseAlpha={0.06} />
      <div className="relative w-full max-w-sm rounded-3xl border border-ink/10 bg-shiro/95 px-6 py-10 shadow-[0_24px_48px_-32px_rgba(31,27,22,0.6)]">
        <Emblem className="mx-auto h-14 w-14" />

        {checkIn.isPending && (
          <div className="mt-10">
            <div className="mx-auto h-24 w-24 animate-spin rounded-full border-4 border-ink/10 border-t-aka" />
            <p className="mt-6 font-display uppercase tracking-wide text-muted">{t('checkin.working')}</p>
          </div>
        )}

        {ok && (
          <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <motion.div
              initial={reduced ? false : { scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-jade text-6xl text-shiro shadow-[0_20px_40px_-16px_rgba(47,107,79,0.9)]"
            >
              ✓
            </motion.div>
            <p className="mt-6 font-display text-3xl font-bold uppercase tracking-wide text-ink">
              {ok.status === 'already' ? t('checkin.already') : t('checkin.done')}
            </p>
            <p className="mt-2 text-muted">
              {ok.title} · {ok.start_time}
            </p>
          </motion.div>
        )}

        {err && (
          <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-aka/10 text-5xl text-aka-text">!</div>
            <p className="mt-6 font-display text-2xl font-bold uppercase tracking-wide text-ink">{t('checkin.failTitle')}</p>
            <p className="mt-2 text-muted">{t(`checkin.errors.${err}`)}</p>
          </motion.div>
        )}

        <Link
          to="/app"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-2xl bg-ink px-8 font-display text-sm uppercase tracking-wide text-shiro"
        >
          {t('checkin.toApp')}
        </Link>
      </div>
    </div>
  )
}
