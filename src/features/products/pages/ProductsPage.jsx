import { useCallback, useEffect, useState } from 'react'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import { useProductFilters } from '../hooks/useProductFilters'
import { getSubCategoriesForParents, pruneSubsForCategories } from '../utils/categoryTaxonomy'
import { toggleListValue } from '../utils/productFilters'
import ProductFiltersSidebar from '../components/ProductFiltersSidebar'
import ProductFiltersDrawer from '../components/ProductFiltersDrawer'
import ProductListingToolbar from '../components/ProductListingToolbar'
import ActiveFilterChips from '../components/ActiveFilterChips'
import ProductResultsGrid from '../components/ProductResultsGrid'
import ProductPagination from '../components/ProductPagination'

export default function ProductsPage() {
  const {
    filters,
    pagination,
    facets,
    activeFilters,
    pageTitle,
    breadcrumbs,
    categories,
    subCategories,
    brands,
    allProducts,
    setFilter,
    toggleFilterValue,
    removeFilterValue,
    clearAllFilters,
    setPage,
    applyFilters,
    resultCount,
  } = useProductFilters()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(filters)

  useEffect(() => {
    if (!drawerOpen) setDraftFilters(filters)
  }, [filters, drawerOpen])

  const draftSubCategories = getSubCategoriesForParents(draftFilters.categories)

  const handleScalarChange = useCallback(
    (key, value) => setFilter(key, value),
    [setFilter],
  )

  const handleDraftToggle = useCallback((key, slug) => {
    setDraftFilters((current) => {
      if (key === 'categories') {
        const categories = toggleListValue(current.categories, slug)
        const subs = pruneSubsForCategories(current.subs, categories)
        return { ...current, categories, subs }
      }
      if (key === 'subs') {
        return { ...current, subs: toggleListValue(current.subs, slug) }
      }
      if (key === 'brands') {
        return { ...current, brands: toggleListValue(current.brands, slug) }
      }
      return current
    })
  }, [])

  const handleDraftScalarChange = useCallback((key, value) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const handleApplyDrawer = useCallback(() => {
    applyFilters(draftFilters)
    setDrawerOpen(false)
  }, [applyFilters, draftFilters])

  const panelProps = {
    filters,
    categories,
    subCategories,
    brands,
    facets,
    allProducts,
    onToggle: toggleFilterValue,
    onScalarChange: handleScalarChange,
    onClearAll: clearAllFilters,
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />

      <header className="px-4 pt-4 sm:pt-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {pageTitle}
        </h1>
        {filters.q ? (
          <p className="mt-1 text-sm text-ink-muted">
            Showing results matching your search across our catalog.
          </p>
        ) : null}
      </header>

      <div className="mt-4 space-y-3 px-4 sm:mt-6">
        <ProductListingToolbar
          resultCount={resultCount}
          sort={filters.sort}
          onSortChange={(value) => setFilter('sort', value)}
          onOpenFilters={() => setDrawerOpen(true)}
          activeFilterCount={activeFilters.length}
        />

        <ActiveFilterChips
          filters={activeFilters}
          onRemove={removeFilterValue}
          onClearAll={clearAllFilters}
        />
      </div>

      <div className="mt-4 flex gap-6 px-4 pb-10 sm:mt-6">
        <ProductFiltersSidebar {...panelProps} />

        <div className="min-w-0 flex-1">
          <ProductResultsGrid products={pagination.items} />

          {resultCount > 0 ? (
            <ProductPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              onPageChange={setPage}
            />
          ) : null}

          {resultCount === 0 ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-md border-2 border-brand px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <ProductFiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        draftFilters={draftFilters}
        onToggle={handleDraftToggle}
        onScalarChange={handleDraftScalarChange}
        onApply={handleApplyDrawer}
        onClearAll={() => {
          clearAllFilters()
          setDrawerOpen(false)
        }}
        categories={categories}
        subCategories={draftSubCategories}
        brands={brands}
        facets={facets}
        allProducts={allProducts}
      />
    </div>
  )
}
