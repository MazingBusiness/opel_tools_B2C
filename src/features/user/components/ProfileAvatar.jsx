import { getInitials } from '../utils/profileHelpers'

/**
 * @param {{
 *   name?: string,
 *   avatarUrl?: string,
 *   size?: 'xs' | 'sm' | 'md' | 'lg',
 *   className?: string,
 * }} props
 */
export default function ProfileAvatar({
  name = '',
  avatarUrl = '',
  size = 'md',
  className = '',
}) {
  const sizes = {
    xs: 'size-5 text-[8px]',
    sm: 'size-8 text-[11px]',
    md: 'size-12 text-sm',
    lg: 'size-20 text-xl',
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || 'Profile photo'}
        className={`shrink-0 rounded-full object-cover ${sizes[size]} ${className}`}
      />
    )
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-ink-inverse ${sizes[size]} ${className}`}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  )
}
