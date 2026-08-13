import { FiStar } from 'react-icons/fi'

/**
 * @param {{
 *   rating: number,
 *   reviewCount?: number,
 *   size?: 'sm' | 'md',
 *   showCount?: boolean,
 *   className?: string,
 * }} props
 */
export default function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
  className = '',
}) {
  const starSize = size === 'md' ? 'size-4' : 'size-3'
  const textSize = size === 'md' ? 'text-sm' : 'text-[11px]'

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold text-success ${textSize} ${className}`}
    >
      <FiStar className={`${starSize} fill-success text-success`} aria-hidden />
      <span>{rating.toFixed(1)}</span>
      {showCount && reviewCount != null ? (
        <span className="font-normal text-ink-muted">({reviewCount})</span>
      ) : null}
    </span>
  )
}
