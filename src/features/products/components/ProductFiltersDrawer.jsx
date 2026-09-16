import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import ProductFiltersPanel from './ProductFiltersPanel'

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   draftFilters: import('../utils/productFilters.js').ProductFilterParams,
 *   onToggle: (key: string, slug: string) => void,
 *   onScalarChange: (key: string, value: string | number | boolean | null) => void,
 *   onApply: () => void,
 *   onClearAll: () => void,
 *   groups: Array<{ slug: string, label: string, count?: number | null }>,
 *   categories: Array<{ slug: string, label: string, count?: number | null }>,
 *   brands: Array<{ slug: string, label: string, count?: number | null }>,
 *   facets: { priceMin: number | null, priceMax: number | null },
 * }} props
 */
export default function ProductFiltersDrawer({
  open,
  onClose,
  draftFilters,
  onToggle,
  onScalarChange,
  onApply,
  onClearAll,
  groups,
  categories,
  brands,
  facets,
}) {
  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-bold text-ink">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            aria-label="Close"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ProductFiltersPanel
            filters={draftFilters}
            groups={groups}
            categories={categories}
            brands={brands}
            facets={facets}
            onToggle={onToggle}
            onScalarChange={onScalarChange}
            onClearAll={onClearAll}
            idPrefix="drawer"
            pickerVariant="panel"
          />
        </div>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  )
}
