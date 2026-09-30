import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useClub } from '../hooks/useClub'
import { useMember } from '../hooks/useMember'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { data: club } = useClub()
  const { data: member, isLoading } = useMember(club?.id)

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">...</div>
  }

  if (!member || (member.role !== 'owner' && member.role !== 'coach')) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-muted">
        {t('admin.noAccess')}
      </div>
    )
  }

  return <>{children}</>
}
