import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="12">?</text></svg>',
  )

const PREVIEW_COUNT = 4

/**
 * Subcategory discovery strip — same tile size always; View all only reveals more.
 * @param {{
 *   items: Array<{ slug: string, title: string, imageUrl: string, description?: string, href: string }>,
 *   label?: string,
 * }} props
 */
export default function SubcategoryStrip({ items, label = 'Shop by sub-category' }) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()

  if (!items?.length) return null

  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT)
  const canExpand = items.length > PREVIEW_COUNT

  return (
    <section className="px-4" aria-labelledby={listId}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 id={listId} className="text-base font-bold text-ink sm:text-lg">
          {label}
        </h2>
        {canExpand ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-dark"
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : 'View all sub-categories'}
            {expanded ? (
              <FiChevronUp className="size-4" aria-hidden />
            ) : (
              <FiChevronDown className="size-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      <ul className="flex flex-wrap gap-3">
        {visible.map((item) => (
          <li key={item.slug} className="w-[7.5rem] shrink-0 sm:w-32">
            <Link
              to={item.href}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="flex aspect-square w-full overflow-hidden rounded-full border border-border bg-surface-muted transition group-hover:border-brand/50 group-hover:shadow-md">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = PLACEHOLDER
                  }}
                />
              </span>
              <span className="line-clamp-2 text-xs font-semibold leading-snug text-ink group-hover:text-brand sm:text-sm">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
