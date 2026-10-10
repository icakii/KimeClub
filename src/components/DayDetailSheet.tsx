import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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

  return (
    <AnimatePresence>
      {date && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-ink/60"
          />
          <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="pointer-events-auto max-h-[75vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg uppercase tracking-wide text-ink">
                  {new Date(date + 'T00:00:00').toLocaleDateString(i18n.resolvedLanguage, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h2>
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
                      className="rounded-md border border-gold bg-ink/5 p-3 text-sm"
                    >
                      <p className="font-display uppercase tracking-wide text-ink">
                        🏆 {entry.competition.name}
                      </p>
                      {entry.competition.location && (
                        <p className="mt-0.5 text-muted">{entry.competition.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {classes.length === 0 ? (
                myCompetitionEntries.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted">
                    {t('schedule.calendar.noClasses')}
                  </p>
                )
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => {
                    const notice = notices.find((n) => n.class_id === cls.id)
                    const signedUp = signedUpClassIds.includes(cls.id)
                    return (
                      <div key={cls.id} className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-ink">{cls.title}</p>
                            {notice && (
                              <span className="rounded-full bg-aka px-2 py-0.5 text-[10px] font-display uppercase tracking-wide text-shiro">
                                {t('studentHome.changed')}
                              </span>
                            )}
                          </div>
                          {notice && <p className="mt-1 text-sm text-aka-text">{notice.note}</p>}
                          {canSignUp && (
                            <div className="mt-2 flex items-center gap-2">
                              {signedUp && (
                                <span className="text-xs text-aka-text">
                                  {t('schedule.signedUp')}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => onToggleSignup(cls.id, signedUp)}
                                className={`min-h-9 rounded-md border px-3 text-xs uppercase tracking-wide ${
                                  signedUp
                                    ? 'border-line text-muted'
                                    : 'border-aka bg-aka text-shiro'
                                }`}
                              >
                                {signedUp ? t('schedule.cancelSignUp') : t('schedule.signUp')}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="shrink-0 text-sm text-muted">
                          {(notice?.new_start_time ?? cls.start_time).slice(0, 5)}
                        </p>
                      </div>
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
