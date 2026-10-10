import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Eyebrow, PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { useClub } from '../../hooks/useClub'
import { useCompetitions, useMyCompetitionEntries } from '../../hooks/useCompetitions'
import { useMember } from '../../hooks/useMember'

const MEDAL_EMOJI: Record<string, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' }
const MEDAL_CARD: Record<string, string> = {
  gold: 'bg-linear-to-br from-kin to-gold text-shiro',
  silver: 'bg-linear-to-br from-[#c9c6bd] to-[#8d8a82] text-shiro',
  bronze: 'bg-linear-to-br from-[#c98a5a] to-[#7a4a2b] text-shiro',
}

// Counts up from 0 on mount -- small, but it makes the tally feel earned.
function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v))
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 })
    return () => controls.stop()
  }, [mv, value])
  return <motion.span>{rounded}</motion.span>
}

export function Competitions() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: competitions } = useCompetitions(club?.id)
  const { data: myEntries } = useMyCompetitionEntries(club?.id, member?.id)

  const todayISO = new Date().toISOString().slice(0, 10)
  const upcoming = (competitions ?? [])
    .filter((c) => c.event_date >= todayISO)
    .sort((a, b) => (a.event_date < b.event_date ? -1 : 1))
  const myUpcomingIds = new Set(
    (myEntries ?? []).filter((e) => e.competition.event_date >= todayISO).map((e) => e.competition_id),
  )
  const pastResults = (myEntries ?? [])
    .filter((e) => e.competition.event_date < todayISO)
    .sort((a, b) => (a.competition.event_date < b.competition.event_date ? 1 : -1))
  const tally = {
    gold: pastResults.filter((e) => e.medal === 'gold').length,
    silver: pastResults.filter((e) => e.medal === 'silver').length,
    bronze: pastResults.filter((e) => e.medal === 'bronze').length,
  }

  function dateParts(iso: string) {
    const d = new Date(`${iso}T00:00:00`)
    return {
      day: d.getDate(),
      month: d.toLocaleDateString(i18n.resolvedLanguage, { month: 'short' }),
      full: d.toLocaleDateString(i18n.resolvedLanguage, { day: 'numeric', month: 'long', year: 'numeric' }),
    }
  }

  return (
    <div className="px-5 pb-6 pt-5">
      <PageHeader kanji="勝" title={t('competitions.title')} tone="bg-kin" />

      <Stagger className="mt-5 space-y-4">
        <StaggerItem>
          <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-shiro shadow-[0_24px_48px_-24px_rgba(31,27,22,0.8)]">
            <span
              className="pointer-events-none absolute -right-3 -top-6 font-brush text-[7rem] leading-none text-shiro/5"
              aria-hidden="true"
            >
              勝
            </span>
            <div className="relative grid grid-cols-3 text-center">
              {(['gold', 'silver', 'bronze'] as const).map((m) => (
                <div key={m}>
                  <p className="text-2xl">{MEDAL_EMOJI[m]}</p>
                  <p
                    className={`mt-1 font-display text-3xl font-bold ${
                      m === 'gold' ? 'text-kin' : m === 'silver' ? 'text-shiro/90' : 'text-sakura'
                    }`}
                  >
                    <CountUp value={tally[m]} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <Eyebrow className="px-1 pt-2">{t('competitions.upcoming')}</Eyebrow>
        </StaggerItem>
        {upcoming.length === 0 ? (
          <StaggerItem>
            <Card>
              <p className="text-sm text-muted">{t('competitions.noUpcoming')}</p>
            </Card>
          </StaggerItem>
        ) : (
          upcoming.map((c) => {
            const d = dateParts(c.event_date)
            const entered = myUpcomingIds.has(c.id)
            return (
              <StaggerItem key={c.id}>
                <Card className={`flex items-center gap-4 ${entered ? 'border-aka/40' : ''}`}>
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-ai text-shiro">
                    <span className="font-display text-xl font-bold leading-none">{d.day}</span>
                    <span className="text-[9px] uppercase tracking-wider text-shiro/70">{d.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold uppercase tracking-wide text-ink">
                      {c.name}
                    </p>
                    {c.location && <p className="truncate text-xs text-muted">{c.location}</p>}
                  </div>
                  {entered && <span className="text-lg">🏆</span>}
                </Card>
              </StaggerItem>
            )
          })
        )}

        <StaggerItem>
          <Eyebrow className="px-1 pt-2">{t('competitions.myResults')}</Eyebrow>
        </StaggerItem>
        {pastResults.length === 0 ? (
          <StaggerItem>
            <Card>
              <p className="text-sm text-muted">{t('competitions.noResults')}</p>
            </Card>
          </StaggerItem>
        ) : (
          pastResults.map((entry) => (
            <StaggerItem key={entry.id}>
              <div
                className={`rounded-2xl p-4 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)] ${
                  entry.medal ? MEDAL_CARD[entry.medal] : 'border border-ink/10 bg-shiro/95 text-ink'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-semibold uppercase tracking-wide">
                    {entry.competition.name}
                  </p>
                  {entry.medal && <span className="text-2xl">{MEDAL_EMOJI[entry.medal]}</span>}
                </div>
                <p className={`text-xs ${entry.medal ? 'text-shiro/80' : 'text-muted'}`}>
                  {dateParts(entry.competition.event_date).full}
                  {entry.category ? ` — ${entry.category}` : ''}
                </p>
                {entry.placement && (
                  <p
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      entry.medal ? 'bg-shiro/20' : 'bg-aka/10 text-aka-text'
                    }`}
                  >
                    {entry.placement}
                  </p>
                )}
              </div>
            </StaggerItem>
          ))
        )}
      </Stagger>
    </div>
  )
}
