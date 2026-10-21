import { useTranslation } from 'react-i18next'
import { useMemberGrades } from '../../hooks/useGrades'
import { Stars } from '../Stars'

// The student's star grades from the coach (clubs with the grades option).
export function MyGradesCard({ memberId }: { memberId: string }) {
  const { t, i18n } = useTranslation()
  const { data: grades } = useMemberGrades(memberId)
  if (!grades) return null
  const average = grades.length ? grades.reduce((s, g) => s + g.stars, 0) / grades.length : 0

  return (
    <div className="relative overflow-hidden rounded-3xl border border-kin/40 bg-shiro/95 p-5 shadow-[0_16px_32px_-24px_rgba(31,27,22,0.55)]">
      <span className="pointer-events-none absolute -bottom-6 right-2 font-brush text-7xl leading-none text-kin/15" aria-hidden="true">
        星
      </span>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t('grades.title')}</p>
      {grades.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{t('grades.none')}</p>
      ) : (
        <>
          <div className="mt-2 flex items-center gap-3">
            <Stars value={average} size="h-7 w-7" />
            <span className="font-display text-2xl font-bold text-ink">{average.toFixed(1)}</span>
          </div>
          <ul className="relative mt-4 space-y-2">
            {grades.slice(0, 5).map((g) => (
              <li key={g.id} className="flex items-center gap-3 border-t border-ink/10 pt-2">
                <Stars value={g.stars} size="h-4 w-4" />
                <span className="text-xs text-muted">{new Date(g.given_on).toLocaleDateString(i18n.resolvedLanguage)}</span>
                {g.note && <span className="min-w-0 flex-1 truncate text-sm text-ink">{g.note}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
