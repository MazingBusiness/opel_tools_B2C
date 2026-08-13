import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

/**
 * @param {{
 *   title: string,
 *   titleId?: string,
 *   viewAllHref?: string,
 *   viewAllLabel?: string,
 *   className?: string,
 * }} props
 */
export default function SectionHeading({
  title,
  titleId,
  viewAllHref,
  viewAllLabel = 'View all',
  className = '',
}) {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <h2
        id={titleId}
        className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
      >
        <span
          className="inline-block h-7 w-1 shrink-0 rounded-full bg-brand sm:h-8"
          aria-hidden
        />
        {title}
      </h2>
      {viewAllHref ? (
        <Link
          to={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink transition hover:text-brand"
        >
          {viewAllLabel}
          <FiArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  )
}
