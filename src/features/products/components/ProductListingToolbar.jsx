import { FiSliders } from 'react-icons/fi'
import { SORT_OPTIONS } from '../utils/productFilters'

/**
 * @param {{
 *   resultCount: number,
 *   sort: string,
 *   onSortChange: (value: string) => void,
 *   onOpenFilters: () => void,
 *   activeFilterCount: number,
 * }} props
 */
export default function ProductListingToolbar({
  resultCount,
  sort,
  onSortChange,
  onOpenFilters,
  activeFilterCount,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">
        <span className="font-semibold text-ink">{resultCount}</span>{' '}
        {resultCount === 1 ? 'product' : 'products'}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand lg:hidden"
        >
          <FiSliders className="size-4" aria-hidden />
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-ink-inverse">
              {activeFilterCount}
            </span>
          ) : null}
        </button>

        <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-md border border-border bg-surface px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-brand"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
