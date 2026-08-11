import ProductFiltersPanel from './ProductFiltersPanel'

export default function ProductFiltersSidebar(props) {
  return (
    <aside
      className="hidden shrink-0 lg:block lg:w-[260px]"
      aria-label="Product filters"
    >
      <div className="sticky top-[calc(var(--header-offset,120px)+1rem)] max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-4 text-sm font-bold text-ink">Filters</h2>
        <ProductFiltersPanel {...props} idPrefix="sidebar" />
      </div>
    </aside>
  )
}
