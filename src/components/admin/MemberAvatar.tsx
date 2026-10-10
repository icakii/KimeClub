import { usePhotoUrl } from '../../hooks/useAdminMembers'
import { initials } from './ui'

// Photo if the member has one, otherwise initials on a colored disc.
export function MemberAvatar({
  name,
  photoPath,
  tone = 'bg-aka',
  className = 'h-11 w-11 text-sm',
}: {
  name: string
  photoPath: string | null
  tone?: string
  className?: string
}) {
  const { data: url } = usePhotoUrl(photoPath)

  if (photoPath && url) {
    return <img src={url} alt="" className={`shrink-0 rounded-full object-cover ring-2 ring-shiro ${className}`} />
  }
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-shiro ${tone} ${className}`}
    >
      {initials(name)}
    </span>
  )
}
