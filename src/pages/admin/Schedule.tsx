import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { DAY_KANJI, PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { useClub } from '../../hooks/useClub'
import { useDeleteClass, useGroups, useSaveClass, type ClassInput } from '../../hooks/useClubAdmin'
import { useSchedule, type ClassRow } from '../../hooks/useSchedule'

const fieldClass =
  'mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-kuro px-3 text-ink outline-none transition-colors focus:border-aka-text'
const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted'

function ClassForm({ clubId, cls, onClose }: { clubId: string; cls: ClassRow | null; onClose: () => void }) {
  const { t } = useTranslation()
  const { data: groups } = useGroups(clubId)
  const save = useSaveClass(clubId)
  const remove = useDeleteClass(clubId)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]
  const [f, setF] = useState<ClassInput>({
    title: cls?.title ?? '',
    weekday: cls?.weekday ?? 0,
    start_time: cls?.start_time.slice(0, 5) ?? '18:00',
    duration_min: cls?.duration_min ?? 60,
    group_id: cls?.group_id ?? null,
    room: cls?.own_room ?? null,
  })
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await save.mutateAsync({ id: cls?.id, input: { ...f, room: f.room?.trim() || null } })
      onClose()
    } catch {
      setError(t('admin.edit.error'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 sm:items-center sm:px-6"
      onClick={onClose}
    >
      <motion.form
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
        className="grid w-full max-w-lg gap-3 rounded-t-3xl bg-shiro p-6 shadow-2xl sm:grid-cols-2 sm:rounded-3xl"
      >
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-ink sm:col-span-2">
          {cls ? t('admin.schedule.edit') : t('admin.schedule.add')}
        </h2>
        <label className="sm:col-span-2">
          <span className={labelClass}>{t('admin.schedule.name')}</span>
          <input required maxLength={80} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>{t('admin.schedule.day')}</span>
          <select value={f.weekday} onChange={(e) => setF({ ...f, weekday: Number(e.target.value) })} className={fieldClass}>
            {weekdays.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>{t('admin.schedule.time')}</span>
          <input type="time" required value={f.start_time} onChange={(e) => setF({ ...f, start_time: e.target.value })} className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>{t('admin.schedule.duration')}</span>
          <input type="number" min={15} step={5} required value={f.duration_min} onChange={(e) => setF({ ...f, duration_min: Number(e.target.value) })} className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>{t('admin.edit.group')}</span>
          <select value={f.group_id ?? ''} onChange={(e) => setF({ ...f, group_id: e.target.value || null })} className={fieldClass}>
            <option value="">{t('admin.schedule.everyone')}</option>
            {groups?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>{t('admin.schedule.room')}</span>
          <input
            maxLength={40}
            placeholder={groups?.find((g) => g.id === f.group_id)?.room ?? t('admin.schedule.roomPlaceholder')}
            value={f.room ?? ''}
            onChange={(e) => setF({ ...f, room: e.target.value })}
            className={fieldClass}
          />
        </label>
        {error && <p className="rounded-xl bg-aka/10 px-4 py-3 text-sm text-aka-text sm:col-span-2">{error}</p>}
        <div className="flex gap-3 pt-2 sm:col-span-2">
          {cls && (
            <button
              type="button"
              onClick={async () => {
                if (confirm(t('admin.schedule.confirmDelete', { name: cls.title }))) {
                  await remove.mutateAsync(cls.id)
                  onClose()
                }
              }}
              className="min-h-12 rounded-xl border border-aka/30 px-4 font-display text-sm uppercase tracking-wide text-aka-text"
            >
              {t('admin.schedule.delete')}
            </button>
          )}
          <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-ink/15 font-display text-sm uppercase tracking-wide text-muted">
            {t('admin.edit.cancel')}
          </button>
          <button type="submit" disabled={save.isPending} className="min-h-12 flex-1 rounded-xl bg-aka font-display text-sm uppercase tracking-wide text-shiro disabled:opacity-60">
            {save.isPending ? '...' : t('admin.edit.save')}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export function Schedule() {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: classes } = useSchedule(club?.id)
  const { data: groups } = useGroups(club?.id)
  const [editing, setEditing] = useState<ClassRow | 'new' | null>(null)
  const weekdays = t('schedule.weekdays', { returnObjects: true }) as string[]

  if (!club) return null

  return (
    <div className="px-5 py-6">
      <PageHeader kanji="稽" title={t('admin.schedule.title')} tone="bg-jade">
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="shrink-0 rounded-full bg-aka px-4 py-2.5 font-display text-xs uppercase tracking-wide text-shiro shadow-[0_10px_20px_-10px_rgba(194,54,31,0.9)] transition-transform active:scale-95"
        >
          + {t('admin.schedule.add')}
        </button>
      </PageHeader>

      <Stagger className="mt-5 grid gap-3 sm:grid-cols-2">
        {(classes ?? []).map((c) => (
          <StaggerItem key={c.id}>
            <button
              type="button"
              onClick={() => setEditing(c)}
              className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-shiro/95 p-4 text-left shadow-[0_16px_32px_-26px_rgba(31,27,22,0.55)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink font-brush text-2xl text-shiro">
                {DAY_KANJI[c.weekday]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg font-semibold uppercase tracking-wide text-ink">{c.title}</span>
                <span className="block text-sm text-muted">
                  {weekdays[c.weekday]} · {c.start_time.slice(0, 5)} · {c.duration_min} {t('admin.schedule.min')}
                </span>
                <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] uppercase tracking-wide">
                  <span className="rounded-full bg-ai/10 px-2 py-0.5 text-ai">
                    {groups?.find((g) => g.id === c.group_id)?.name ?? t('admin.schedule.everyone')}
                  </span>
                  {c.room && <span className="rounded-full bg-kin/15 px-2 py-0.5 text-gold">{c.room}</span>}
                </span>
              </span>
              <span className="text-muted">✎</span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {editing && (
          <ClassForm clubId={club.id} cls={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
