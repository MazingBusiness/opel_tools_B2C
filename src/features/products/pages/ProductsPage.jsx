import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import { getErrorMessage } from '../../../shared/api/client'
import { useProductFilters } from '../hooks/useProductFilters'
import {
  toggleListValue,
  pruneCategoriesForGroups,
  categoriesForGroups,
} from '../utils/productFilters'
import ProductFiltersSidebar from '../components/ProductFiltersSidebar'
import ProductFiltersDrawer from '../components/ProductFiltersDrawer'
import ProductListingToolbar from '../components/ProductListingToolbar'
import ActiveFilterChips from '../components/ActiveFilterChips'
import ProductResultsGrid from '../components/ProductResultsGrid'
import ProductPagination from '../components/ProductPagination'
import { PRODUCT_GRID_CLASS } from '../utils/productGridLayout'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const legacyId = searchParams.get('id')

  const {
    gridRef,
    filters,
    pagination,
    facets,
    activeFilters,
    pageTitle,
    breadcrumbs,
    groups,
    categories,
    brands,
    groupTree,
    setFilter,
    toggleFilterValue,
    removeFilterValue,
    clearAllFilters,
    setPage,
    applyFilters,
    resultCount,
    isLoading,
    isFetching,
    isError,
    error,
  } = useProductFilters()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(filters)

  useEffect(() => {
    if (!drawerOpen) setDraftFilters(filters)
  }, [filters, drawerOpen])

  const handleScalarChange = useCallback(
    (key, value) => setFilter(key, value),
    [setFilter],
  )

  const handleDraftToggle = useCallback(
    (key, slug) => {
      setDraftFilters((current) => {
        if (key === 'groups') {
          const nextGroups = toggleListValue(current.groups, slug)
          const nextCategories = pruneCategoriesForGroups(
            current.categories,
            nextGroups,
            groupTree,
          )
          return { ...current, groups: nextGroups, categories: nextCategories }
        }
        if (key === 'categories') {
          return {
            ...current,
            categories: toggleListValue(current.categories, slug),
          }
        }
        if (key === 'brands') {
          return { ...current, brands: toggleListValue(current.brands, slug) }
        }
        return current
      })
    },
    [groupTree],
  )

  const draftCategories = useMemo(
    () => categoriesForGroups(groupTree, draftFilters.groups ?? []),
    [groupTree, draftFilters.groups],
  )

  const handleDraftScalarChange = useCallback((key, value) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const handleApplyDrawer = useCallback(() => {
    applyFilters(draftFilters)
    setDrawerOpen(false)
  }, [applyFilters, draftFilters])

  if (legacyId) {
    return <Navigate to={`/products/${legacyId}`} replace />
  }

  const panelProps = {
    filters,
    groups,
    categories,
    brands,
    facets,
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
          isFetching={isFetching}
        />

        <ActiveFilterChips
          filters={activeFilters}
          onRemove={removeFilterValue}
          onClearAll={clearAllFilters}
        />
      </div>

      <div className="mt-4 flex gap-6 px-4 pb-10 sm:mt-6">
        <ProductFiltersSidebar {...panelProps} />

        <div ref={gridRef} className="min-w-0 flex-1">
          {isError ? (
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50 px-6 py-10 text-center">
              <p className="text-base font-semibold text-ink">
                Could not load products
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {getErrorMessage(error, 'Check that the API is running and try again.')}
              </p>
            </div>
          ) : null}

          {!isError && isLoading ? (
            <div className={PRODUCT_GRID_CLASS}>
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] animate-pulse rounded-lg border border-border bg-surface-muted"
                />
              ))}
            </div>
          ) : null}

          {!isError && !isLoading ? (
            <>
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
            </>
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
        groups={groups}
        categories={draftCategories}
        brands={brands}
        facets={facets}
      />
    </div>
  )
}
