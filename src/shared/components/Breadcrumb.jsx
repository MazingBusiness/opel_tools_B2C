import { Fragment } from 'react'
import { Link } from 'react-router-dom'

/**
 * Compact nested page mapper — soft trail, vertically centered in its own row.
 *
 * @param {{
 *   items: Array<{ label: string, href?: string }>,
 *   className?: string,
 * }} props
 */
export default function Breadcrumb({ items, className = '' }) {
  if (!items?.length) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={['flex min-h-6 items-center px-4 py-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-none text-ink-muted/80 sm:text-xs sm:leading-tight">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className="select-none text-[10px] text-ink-muted/40">
                  &gt;
                </li>
              ) : null}
              <li>
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="text-ink-muted/75 transition hover:text-brand"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast ? 'font-medium text-ink/70' : 'text-ink-muted/75'
                    }
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
