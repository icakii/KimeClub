import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BeltChip } from '../../components/BeltChip'
import { useClub } from '../../hooks/useClub'
import { useAuth } from '../../hooks/useAuth'
import { useMember } from '../../hooks/useMember'

export function Profile() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { signOut } = useAuth()

  return (
    <div className="px-6 pb-6 pt-8">
      <h1 className="font-display text-xl uppercase tracking-wide">{t('profilePage.title')}</h1>

      {member && (
        <div className="mt-4 space-y-4 rounded-lg border border-line bg-surface p-4">
          <p className="font-display uppercase tracking-wide text-ink">{member.full_name}</p>
          {member.belt && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">{t('profilePage.belt')}</p>
              <div className="mt-1">
                <BeltChip belt={member.belt} />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2 font-display text-sm uppercase tracking-wide">
        <button
          type="button"
          onClick={() => i18n.changeLanguage('bg')}
          className={i18n.resolvedLanguage === 'bg' ? 'text-aka-text' : 'text-muted'}
        >
          BG
        </button>
        <span className="text-line">|</span>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          className={i18n.resolvedLanguage === 'en' ? 'text-aka-text' : 'text-muted'}
        >
          EN
        </button>
      </div>

      {(member?.role === 'owner' || member?.role === 'coach') && (
        <Link
          to="/admin"
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-md border border-line px-4 font-display text-sm uppercase tracking-wide text-ink"
        >
          {t('admin.title')}
        </Link>
      )}

      <button
        type="button"
        onClick={() => signOut()}
        className="mt-4 min-h-11 w-full rounded-md border border-line px-4 font-display text-sm uppercase tracking-wide text-aka-text"
      >
        {t('profilePage.logout')}
      </button>
    </div>
  )
}
