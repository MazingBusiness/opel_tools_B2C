import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllProducts } from '../data/productCatalog'
import {
  parseFilterParams,
  buildFilterSearchParams,
  filterAndSortProducts,
  paginateProducts,
  buildActiveFilters,
  buildPageTitle,
  buildBreadcrumbs,
  toggleListValue,
} from '../utils/productFilters'
import { getFilterFacets } from '../data/productCatalog'
import {
  getTopLevelCategories,
  getSubCategoriesForParents,
  getAllBrandOptions,
  pruneSubsForCategories,
} from '../utils/categoryTaxonomy'

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const allProducts = useMemo(() => getAllProducts(), [])

  const filters = useMemo(
    () => parseFilterParams(searchParams),
    [searchParams],
  )

  const filteredProducts = useMemo(
    () => filterAndSortProducts(allProducts, filters),
    [allProducts, filters],
  )

  const pagination = useMemo(
    () => paginateProducts(filteredProducts, filters),
    [filteredProducts, filters],
  )

  const facets = useMemo(
    () => getFilterFacets(allProducts, filters),
    [allProducts, filters],
  )

  const activeFilters = useMemo(() => buildActiveFilters(filters), [filters])
  const pageTitle = useMemo(() => buildPageTitle(filters), [filters])
  const breadcrumbs = useMemo(() => buildBreadcrumbs(filters), [filters])

  const categories = useMemo(() => getTopLevelCategories(), [])
  const subCategories = useMemo(
    () => getSubCategoriesForParents(filters.categories),
    [filters.categories],
  )
  const brands = useMemo(() => getAllBrandOptions(), [])

  const updateFilters = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = { ...filters, ...patch }
      if (resetPage) next.page = 1
      setSearchParams(buildFilterSearchParams(next), { replace: false })
    },
    [filters, setSearchParams],
  )

  const setFilter = useCallback(
    (key, value) => {
      updateFilters({ [key]: value })
    },
    [updateFilters],
  )

  const toggleFilterValue = useCallback(
    (key, slug) => {
      if (key === 'categories') {
        const categories = toggleListValue(filters.categories, slug)
        const subs = pruneSubsForCategories(filters.subs, categories)
        updateFilters({ categories, subs })
        return
      }
      if (key === 'subs') {
        updateFilters({ subs: toggleListValue(filters.subs, slug) })
        return
      }
      if (key === 'brands') {
        updateFilters({ brands: toggleListValue(filters.brands, slug) })
      }
    },
    [filters.categories, filters.subs, filters.brands, updateFilters],
  )

  const removeFilterValue = useCallback(
    (key, value) => {
      if (key === 'categories') {
        const categories = filters.categories.filter((s) => s !== value)
        const subs = pruneSubsForCategories(filters.subs, categories)
        updateFilters({ categories, subs })
        return
      }
      if (key === 'subs') {
        updateFilters({ subs: filters.subs.filter((s) => s !== value) })
        return
      }
      if (key === 'brands') {
        updateFilters({ brands: filters.brands.filter((s) => s !== value) })
        return
      }
      if (key === 'q' || key === 'min' || key === 'max' || key === 'ratingMin') {
        updateFilters({ [key]: null })
      }
    },
    [filters, updateFilters],
  )

  const clearFilterGroup = useCallback(
    (key) => {
      if (key === 'categories') {
        updateFilters({ categories: [], subs: [] })
        return
      }
      if (key === 'subs') {
        updateFilters({ subs: [] })
        return
      }
      if (key === 'brands') {
        updateFilters({ brands: [] })
      }
    },
    [updateFilters],
  )

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false })
  }, [setSearchParams])

  const setPage = useCallback(
    (page) => {
      updateFilters({ page }, { resetPage: false })
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    },
    [updateFilters],
  )

  const applyFilters = useCallback(
    (nextFilters) => {
      setSearchParams(buildFilterSearchParams({ ...nextFilters, page: 1 }), {
        replace: false,
      })
    },
    [setSearchParams],
  )

  return {
    filters,
    filteredProducts,
    allProducts,
    pagination,
    facets,
    activeFilters,
    pageTitle,
    breadcrumbs,
    categories,
    subCategories,
    brands,
    setFilter,
    toggleFilterValue,
    removeFilterValue,
    clearFilterGroup,
    clearAllFilters,
    setPage,
    applyFilters,
    resultCount: filteredProducts.length,
  }
}
