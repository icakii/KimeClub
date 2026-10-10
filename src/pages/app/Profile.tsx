import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader, Stagger, StaggerItem } from '../../components/app/ui'
import { BeltChip } from '../../components/BeltChip'
import { MemberAvatar } from '../../components/admin/MemberAvatar'
import { LegalLinks } from '../../components/LegalLinks'
import { useAuth } from '../../hooks/useAuth'
import { useClub } from '../../hooks/useClub'
import { useMember } from '../../hooks/useMember'

const LANGS = ['bg', 'en'] as const

export function Profile() {
  const { t, i18n } = useTranslation()
  const { data: club } = useClub()
  const { data: member } = useMember(club?.id)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const actionClass =
    'flex min-h-12 w-full items-center justify-center rounded-2xl border border-ink/15 bg-shiro/95 px-4 font-display text-sm uppercase tracking-wide text-ink transition-colors hover:border-aka-text hover:text-aka-text'

  return (
    <div className="px-5 pb-6 pt-5">
      <PageHeader kanji="心" title={t('profilePage.title')} tone="bg-ai" />

      <Stagger className="mt-5 space-y-4">
        {member && (
          <StaggerItem>
            <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-shiro shadow-[0_24px_48px_-24px_rgba(31,27,22,0.8)]">
              <span
                className="pointer-events-none absolute -bottom-8 -right-3 font-brush text-[8rem] leading-none text-shiro/5"
                aria-hidden="true"
              >
                道
              </span>
              <div className="relative flex items-center gap-4">
                <MemberAvatar name={member.full_name} photoPath={member.photo_path} className="h-16 w-16 text-xl ring-4 ring-shiro/15" />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-semibold uppercase tracking-wide">
                    {member.full_name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-shiro/60">
                    {t(`admin.role.${member.role}`)}
                  </p>
                </div>
              </div>
              {member.belt && (
                <div className="relative mt-5 flex items-center gap-3 rounded-2xl bg-shiro/95 px-4 py-3 text-ink">
                  <BeltChip belt={member.belt} showLabel />
                </div>
              )}
            </div>
          </StaggerItem>
        )}

        <StaggerItem>
          <div className="relative flex rounded-2xl border border-ink/10 bg-shiro/95 p-1">
            {LANGS.map((lang) => {
              const active = i18n.resolvedLanguage === lang
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`relative flex-1 rounded-xl py-2.5 font-display text-sm uppercase tracking-wide transition-colors ${
                    active ? 'text-shiro' : 'text-muted'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-xl bg-ai"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{lang === 'bg' ? 'Български' : 'English'}</span>
                </button>
              )
            })}
          </div>
        </StaggerItem>

        {(member?.role === 'owner' || member?.role === 'coach') && (
          <StaggerItem>
            <Link to="/admin" className={actionClass}>
              {t('admin.title')}
            </Link>
          </StaggerItem>
        )}

        <StaggerItem>
          <Link to="/" className={actionClass}>
            {t('profilePage.viewSite')}
          </Link>
        </StaggerItem>

        <StaggerItem>
          <button
            type="button"
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
            className="min-h-12 w-full rounded-2xl bg-aka px-4 font-display text-sm uppercase tracking-wide text-shiro shadow-[0_12px_24px_-12px_rgba(194,54,31,0.9)] transition-transform active:scale-[0.98]"
          >
            {t('profilePage.logout')}
          </button>
        </StaggerItem>

        <StaggerItem>
          <LegalLinks className="pt-4" />
        </StaggerItem>
      </Stagger>
    </div>
  )
}
