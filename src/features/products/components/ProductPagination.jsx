import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * Build a compact page number list with ellipsis.
 * @param {number} current
 * @param {number} total
 */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  /** @type {(number | 'ellipsis')[]} */
  const pages = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i += 1) pages.push(i)

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

/**
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   total: number,
 *   startIndex: number,
 *   endIndex: number,
 *   onPageChange: (page: number) => void,
 * }} props
 */
export default function ProductPagination({
  page,
  totalPages,
  total,
  startIndex,
  endIndex,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <nav
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      aria-label="Product pagination"
    >
      <p className="text-sm text-ink-muted">
        Showing{' '}
        <span className="font-medium text-ink">
          {startIndex}–{endIndex}
        </span>{' '}
        of <span className="font-medium text-ink">{total}</span> products
      </p>

      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-surface text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <FiChevronLeft className="size-4" />
          </button>
        </li>

        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <li
              key={`ellipsis-${index}`}
              className="flex size-9 items-center justify-center text-sm text-ink-muted"
              aria-hidden
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                className={[
                  'flex size-9 items-center justify-center rounded-md border text-sm font-semibold transition',
                  item === page
                    ? 'border-brand bg-brand text-ink-inverse'
                    : 'border-border bg-surface text-ink hover:border-brand hover:text-brand',
                ].join(' ')}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex size-9 items-center justify-center rounded-md border border-border bg-surface text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <FiChevronRight className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
