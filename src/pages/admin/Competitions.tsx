import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdminMembers } from '../../hooks/useAdminMembers'
import {
  useAddEntry,
  useCompetitionEntries,
  useCompetitions,
  useCreateCompetition,
  useRemoveEntry,
  useUpdateEntry,
} from '../../hooks/useCompetitions'
import { useClub } from '../../hooks/useClub'

const MEDALS = ['gold', 'silver', 'bronze'] as const

export function Competitions() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: competitions } = useCompetitions(club?.id)
  const createCompetition = useCreateCompetition(club?.id)
  const [openId, setOpenId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await createCompetition.mutateAsync({
      name,
      location: location || undefined,
      event_date: eventDate,
    })
    setName('')
    setLocation('')
    setEventDate('')
  }

  return (
    <div className="px-6 py-6">
      <h1 className="font-display text-xl uppercase tracking-wide text-ink">
        {t('admin.competitions.title')}
      </h1>

      <form onSubmit={handleCreate} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.competitions.name')}
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.competitions.location')}
          </span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-muted">
            {t('admin.competitions.date')}
          </span>
          <input
            required
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 min-h-11 rounded-md border border-line bg-surface px-3 text-ink outline-none focus:border-aka-text"
          />
        </label>
        <button
          type="submit"
          disabled={createCompetition.isPending}
          className="min-h-11 rounded-md bg-aka px-4 font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60"
        >
          {t('admin.competitions.add')}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {(competitions ?? []).map((comp) => (
          <div key={comp.id} className="rounded-lg border border-line bg-surface">
            <button
              type="button"
              onClick={() => setOpenId(openId === comp.id ? null : comp.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="text-ink">{comp.name}</p>
                <p className="text-sm text-muted">
                  {comp.event_date}
                  {comp.location ? ` — ${comp.location}` : ''}
                </p>
              </div>
              <span className="text-muted">{openId === comp.id ? '−' : '+'}</span>
            </button>
            {openId === comp.id && <EntriesPanel competitionId={comp.id} clubId={club?.id} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function EntriesPanel({
  competitionId,
  clubId,
}: {
  competitionId: string
  clubId: string | undefined
}) {
  const { t } = useTranslation()
  const { data: members } = useAdminMembers(clubId)
  const { data: entries } = useCompetitionEntries(competitionId)
  const addEntry = useAddEntry(clubId, competitionId)
  const updateEntry = useUpdateEntry(competitionId)
  const removeEntry = useRemoveEntry(competitionId)

  const [memberId, setMemberId] = useState('')
  const [category, setCategory] = useState('')

  const entered = new Set((entries ?? []).map((e) => e.member_id))
  const available = (members ?? []).filter((m) => m.role === 'student' && !entered.has(m.id))

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!memberId) return
    await addEntry.mutateAsync({ member_id: memberId, category: category || undefined })
    setMemberId('')
    setCategory('')
  }

  return (
    <div className="border-t border-line p-4">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="min-h-11 rounded-md border border-line bg-ink px-3 text-sm text-text outline-none focus:border-aka-text"
        >
          <option value="">{t('admin.competitions.pickStudent')}</option>
          {available.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={t('admin.competitions.category') as string}
          className="min-h-11 rounded-md border border-line bg-ink px-3 text-sm text-text outline-none focus:border-aka-text"
        />
        <button
          type="submit"
          disabled={!memberId || addEntry.isPending}
          className="min-h-11 rounded-md border border-line px-3 text-xs uppercase tracking-wide text-muted disabled:opacity-60"
        >
          {t('admin.competitions.addEntry')}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {(entries ?? []).map((entry) => (
          <div
            key={entry.id}
            className="flex flex-wrap items-center gap-2 rounded-md border border-line p-2 text-sm"
          >
            <span className="min-w-[120px] text-ink">
              {(entry as unknown as { member: { full_name: string } }).member.full_name}
            </span>
            <span className="text-muted">{entry.category}</span>
            <input
              value={entry.placement ?? ''}
              onChange={(e) =>
                updateEntry.mutate({ entryId: entry.id, updates: { placement: e.target.value } })
              }
              placeholder={t('admin.competitions.placement') as string}
              className="min-h-9 w-24 rounded-md border border-line bg-ink px-2 text-text outline-none focus:border-aka-text"
            />
            <select
              value={entry.medal ?? ''}
              onChange={(e) =>
                updateEntry.mutate({
                  entryId: entry.id,
                  updates: { medal: (e.target.value || null) as never },
                })
              }
              className="min-h-9 rounded-md border border-line bg-ink px-2 text-text outline-none focus:border-aka-text"
            >
              <option value="">{t('admin.competitions.noMedal')}</option>
              {MEDALS.map((m) => (
                <option key={m} value={m}>
                  {t(`admin.competitions.medals.${m}`)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeEntry.mutate(entry.id)}
              className="ml-auto text-xs text-aka-text"
            >
              {t('admin.competitions.remove')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
