import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import ProductFiltersPanel from './ProductFiltersPanel'

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   draftFilters: import('../utils/productFilters.js').ProductFilterParams,
 *   onToggle: (key: string, slug: string) => void,
 *   onScalarChange: (key: string, value: string | number | null) => void,
 *   onApply: () => void,
 *   onClearAll: () => void,
 *   categories: Array<{ slug: string, label: string }>,
 *   subCategories: Array<{ slug: string, label: string }>,
 *   brands: Array<{ slug: string, label: string }>,
 *   facets: { priceMin: number, priceMax: number },
 *   allProducts: Array<object>,
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
  categories,
  subCategories,
  brands,
  facets,
  allProducts,
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
            className="flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink"
            aria-label="Close"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto p-4">
          <ProductFiltersPanel
            filters={draftFilters}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
            facets={facets}
            allProducts={allProducts}
            onToggle={onToggle}
            onScalarChange={onScalarChange}
            onClearAll={onClearAll}
            idPrefix="drawer"
            pickerVariant="panel"
          />
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={onClearAll}
            className="flex-1 rounded-md border border-border py-2.5 text-sm font-semibold text-ink-muted"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-md bg-brand py-2.5 text-sm font-bold text-ink-inverse"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
