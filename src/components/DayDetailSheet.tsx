import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { DAY_KANJI } from './app/ui'
import type { MyCompetitionEntry } from '../hooks/useCompetitions'
import type { ClassNotice } from '../hooks/useNextClass'
import type { ClassRow } from '../hooks/useSchedule'

export function DayDetailSheet({
  date,
  classes,
  notices,
  onClose,
  signedUpClassIds,
  onToggleSignup,
  canSignUp,
  myCompetitionEntries,
}: {
  date: string | null
  classes: ClassRow[]
  notices: ClassNotice[]
  onClose: () => void
  signedUpClassIds: string[]
  onToggleSignup: (classId: string, signedUp: boolean) => void
  canSignUp: boolean
  myCompetitionEntries: MyCompetitionEntry[]
}) {
  const { t, i18n } = useTranslation()
  const weekday = date ? (new Date(date + 'T00:00:00').getDay() + 6) % 7 : 0

  return (
    <AnimatePresence>
      {date && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/50"
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              // Drag the sheet down to dismiss, like a native bottom sheet.
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) onClose()
              }}
              className="pointer-events-auto max-h-[78vh] w-full max-w-md overflow-y-auto rounded-t-4xl bg-shiro px-6 pb-10 pt-3 shadow-[0_-20px_50px_-20px_rgba(31,27,22,0.5)]"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-aka font-brush text-2xl text-shiro">
                    {DAY_KANJI[weekday]}
                  </span>
                  <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {new Date(date + 'T00:00:00').toLocaleDateString(i18n.resolvedLanguage, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
                >
                  ×
                </button>
              </div>

              {myCompetitionEntries.length > 0 && (
                <div className="mb-4 space-y-2">
                  {myCompetitionEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl bg-linear-to-br from-kin to-gold p-4 text-shiro shadow-md"
                    >
                      <p className="font-display text-sm font-semibold uppercase tracking-wide">
                        🏆 {entry.competition.name}
                      </p>
                      {entry.competition.location && (
                        <p className="mt-0.5 text-xs text-shiro/80">{entry.competition.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {classes.length === 0 ? (
                myCompetitionEntries.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    {t('schedule.calendar.noClasses')}
                  </p>
                )
              ) : (
                <div className="space-y-3">
                  {classes.map((cls, i) => {
                    const notice = notices.find((n) => n.class_id === cls.id)
                    const signedUp = signedUpClassIds.includes(cls.id)
                    return (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.06 }}
                        className={`rounded-2xl border p-4 transition-colors ${
                          signedUp ? 'border-jade/50 bg-jade/10' : 'border-ink/10 bg-kuro/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-display font-semibold uppercase tracking-wide text-ink">
                                {cls.title}
                              </p>
                              {notice && (
                                <span className="rounded-full bg-aka px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-shiro">
                                  {t('studentHome.changed')}
                                </span>
                              )}
                            </div>
                            {cls.room && <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">{cls.room}</p>}
                            {notice && <p className="mt-1 text-sm text-aka-text">{notice.note}</p>}
                          </div>
                          <p className="shrink-0 font-display text-2xl font-bold leading-none text-ink">
                            {(notice?.new_start_time ?? cls.start_time).slice(0, 5)}
                          </p>
                        </div>
                        {canSignUp && (
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <AnimatePresence>
                              {signedUp && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="text-xs font-semibold text-jade"
                                >
                                  ✓ {t('schedule.signedUp')}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.94 }}
                              onClick={() => onToggleSignup(cls.id, signedUp)}
                              className={`ml-auto min-h-10 rounded-xl px-4 font-display text-xs uppercase tracking-wide transition-colors ${
                                signedUp
                                  ? 'border border-line text-muted'
                                  : 'bg-aka text-shiro shadow-[0_8px_16px_-8px_rgba(194,54,31,0.9)]'
                              }`}
                            >
                              {signedUp ? t('schedule.cancelSignUp') : t('schedule.signUp')}
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
