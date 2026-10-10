import { useTranslation } from 'react-i18next'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'
import { useCompetitions, useMyCompetitionEntries } from '../../hooks/useCompetitions'

const MEDAL_EMOJI: Record<string, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' }

export function Competitions() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { data: competitions } = useCompetitions(club?.id)
  const { data: myEntries } = useMyCompetitionEntries(club?.id, member?.id)

  const todayISO = new Date().toISOString().slice(0, 10)
  const upcoming = (competitions ?? []).filter((c) => c.event_date >= todayISO)
  const pastResults = (myEntries ?? [])
    .filter((e) => e.competition.event_date < todayISO)
    .sort((a, b) => (a.competition.event_date < b.competition.event_date ? 1 : -1))

  function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(i18n.resolvedLanguage, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide text-ink">
        {t('competitions.title')}
      </h1>

      <section>
        <h2 className="font-display text-xs uppercase tracking-wide text-muted">
          {t('competitions.upcoming')}
        </h2>
        <div className="mt-2 space-y-2">
          {upcoming.length === 0 && (
            <p className="text-sm text-muted">{t('competitions.noUpcoming')}</p>
          )}
          {upcoming.map((c) => (
            <div key={c.id} className="rounded-lg border border-line bg-surface p-4">
              <p className="text-ink">{c.name}</p>
              <p className="text-sm text-muted">
                {formatDate(c.event_date)}
                {c.location ? ` — ${c.location}` : ''}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xs uppercase tracking-wide text-muted">
          {t('competitions.myResults')}
        </h2>
        <div className="mt-2 space-y-2">
          {pastResults.length === 0 && (
            <p className="text-sm text-muted">{t('competitions.noResults')}</p>
          )}
          {pastResults.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <p className="text-ink">{entry.competition.name}</p>
                {entry.medal && <span>{MEDAL_EMOJI[entry.medal]}</span>}
              </div>
              <p className="text-sm text-muted">
                {formatDate(entry.competition.event_date)}
                {entry.category ? ` — ${entry.category}` : ''}
              </p>
              {entry.placement && <p className="mt-1 text-sm text-aka-text">{entry.placement}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
