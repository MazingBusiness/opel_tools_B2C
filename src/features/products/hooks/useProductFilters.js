import { useCallback, useEffect, useMemo } from 'react'
import { useViewportPageSize } from './useViewportPageSize'
import { useSearchParams } from 'react-router-dom'
import {
  useBrandsQuery,
  useCategoryGroupsQuery,
  useProductsQuery,
} from '../api/hooks'
import { facetCountMap } from '../api/mappers'
import {
  parseFilterParams,
  buildFilterSearchParams,
  buildActiveFilters,
  buildPageTitle,
  buildBreadcrumbs,
  toggleListValue,
  pruneCategoriesForGroups,
  categoriesForGroups,
  normalizePriceRange,
  PAGE_SIZE,
} from '../utils/productFilters'

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { gridRef, perPage: viewportPerPage } = useViewportPageSize()

  const filters = useMemo(
    () => parseFilterParams(searchParams),
    [searchParams],
  )

  const brandsQuery = useBrandsQuery()
  const groupsQuery = useCategoryGroupsQuery()

  const brands = brandsQuery.data ?? []
  const groups = groupsQuery.data ?? []

  const maps = useMemo(() => {
    const allCategories = groups.flatMap((group) => group.categories ?? [])
    const groupIdsBySlug = new Map(groups.map((g) => [g.slug, g.id]))
    const categoryIdsBySlug = new Map(allCategories.map((c) => [c.slug, c.id]))
    const brandIdsBySlug = new Map(brands.map((b) => [b.slug, b.id]))
    return { groupIdsBySlug, categoryIdsBySlug, brandIdsBySlug }
  }, [groups, brands])

  const taxonomyReady =
    brandsQuery.isSuccess && groupsQuery.isSuccess && !brandsQuery.isError

  // Drop URL slugs that don't exist in the live taxonomy (re-runs when filters change).
  useEffect(() => {
    if (!taxonomyReady) return

    const nextGroups = (filters.groups ?? []).filter((slug) =>
      maps.groupIdsBySlug.has(slug),
    )
    const nextCategories = (filters.categories ?? []).filter((slug) =>
      maps.categoryIdsBySlug.has(slug),
    )
    const nextBrands = (filters.brands ?? []).filter((slug) =>
      maps.brandIdsBySlug.has(slug),
    )
    const { min, max } = normalizePriceRange(filters.min, filters.max)

    const changed =
      nextGroups.length !== (filters.groups ?? []).length ||
      nextCategories.length !== (filters.categories ?? []).length ||
      nextBrands.length !== (filters.brands ?? []).length ||
      min !== filters.min ||
      max !== filters.max

    if (!changed) return

    setSearchParams(
      buildFilterSearchParams({
        ...filters,
        groups: nextGroups,
        categories: nextCategories,
        brands: nextBrands,
        min,
        max,
      }),
      { replace: true },
    )
  }, [taxonomyReady, filters, maps, setSearchParams])

  const queryFilters = useMemo(
    () => ({ ...filters, perPage: viewportPerPage }),
    [filters, viewportPerPage],
  )

  const productsQuery = useProductsQuery(queryFilters, maps, taxonomyReady)

  // If resize shrinks page size, keep the current page in range.
  useEffect(() => {
    const total = productsQuery.data?.pagination?.total
    if (total == null) return
    const totalPages = Math.max(1, Math.ceil(total / viewportPerPage))
    if ((filters.page || 1) > totalPages) {
      setSearchParams(
        buildFilterSearchParams({ ...filters, page: totalPages }),
        { replace: true },
      )
    }
  }, [
    viewportPerPage,
    productsQuery.data?.pagination?.total,
    filters,
    setSearchParams,
  ])

  const facetMaps = useMemo(() => {
    const facets = productsQuery.data?.facets
    return {
      groups: facetCountMap(facets?.groups),
      categories: facetCountMap(facets?.categories),
      brands: facetCountMap(facets?.brands),
      priceMin: facets?.priceMin ?? null,
      priceMax: facets?.priceMax ?? null,
    }
  }, [productsQuery.data?.facets])

  const groupOptions = useMemo(
    () =>
      groups.map((group) => ({
        slug: group.slug,
        label: group.label,
        id: group.id,
        count: facetMaps.groups.get(group.id) ?? null,
      })),
    [groups, facetMaps.groups],
  )

  const categoryOptions = useMemo(
    () => categoriesForGroups(groups, filters.groups ?? [], facetMaps.categories),
    [groups, filters.groups, facetMaps.categories],
  )

  const brandOptions = useMemo(
    () =>
      brands.map((brand) => ({
        slug: brand.slug,
        label: brand.label,
        id: brand.id,
        count: facetMaps.brands.get(brand.id) ?? null,
      })),
    [brands, facetMaps.brands],
  )

  const labelIndex = useMemo(
    () => ({
      groups: groupOptions,
      categories: categoryOptions,
      brands: brandOptions,
    }),
    [groupOptions, categoryOptions, brandOptions],
  )

  const activeFilters = useMemo(
    () => buildActiveFilters(filters, labelIndex),
    [filters, labelIndex],
  )
  const pageTitle = useMemo(
    () => buildPageTitle(filters, labelIndex),
    [filters, labelIndex],
  )
  const breadcrumbs = useMemo(
    () => buildBreadcrumbs(filters, labelIndex),
    [filters, labelIndex],
  )

  const pagination = productsQuery.data?.pagination ?? {
    items: [],
    total: 0,
    page: filters.page || 1,
    pageSize: viewportPerPage || PAGE_SIZE,
    totalPages: 1,
    startIndex: 0,
    endIndex: 0,
  }

  const updateFilters = useCallback(
    (patch, { resetPage = true } = {}) => {
      const merged = { ...filters, ...patch }
      const { min, max } = normalizePriceRange(
        merged.min ?? null,
        merged.max ?? null,
      )
      const next = { ...merged, min, max }
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
      if (key === 'groups') {
        const nextGroups = toggleListValue(filters.groups, slug)
        const nextCategories = pruneCategoriesForGroups(
          filters.categories,
          nextGroups,
          groups,
        )
        updateFilters({ groups: nextGroups, categories: nextCategories })
        return
      }
      if (key === 'categories') {
        updateFilters({
          categories: toggleListValue(filters.categories, slug),
        })
        return
      }
      if (key === 'brands') {
        updateFilters({ brands: toggleListValue(filters.brands, slug) })
      }
    },
    [filters.groups, filters.categories, filters.brands, groups, updateFilters],
  )

  const removeFilterValue = useCallback(
    (key, value) => {
      if (key === 'groups') {
        const nextGroups = filters.groups.filter((s) => s !== value)
        const nextCategories = pruneCategoriesForGroups(
          filters.categories,
          nextGroups,
          groups,
        )
        updateFilters({ groups: nextGroups, categories: nextCategories })
        return
      }
      if (key === 'categories') {
        updateFilters({
          categories: filters.categories.filter((s) => s !== value),
        })
        return
      }
      if (key === 'brands') {
        updateFilters({ brands: filters.brands.filter((s) => s !== value) })
        return
      }
      if (key === 'q' || key === 'min' || key === 'max') {
        updateFilters({ [key]: null })
        return
      }
      if (key === 'inStock') {
        updateFilters({ inStock: false })
      }
    },
    [filters, groups, updateFilters],
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
      const { min, max } = normalizePriceRange(
        nextFilters.min ?? null,
        nextFilters.max ?? null,
      )
      setSearchParams(
        buildFilterSearchParams({ ...nextFilters, min, max, page: 1 }),
        { replace: false },
      )
    },
    [setSearchParams],
  )

  return {
    gridRef,
    filters,
    pagination,
    facets: {
      priceMin: facetMaps.priceMin,
      priceMax: facetMaps.priceMax,
    },
    activeFilters,
    pageTitle,
    breadcrumbs,
    groups: groupOptions,
    categories: categoryOptions,
    brands: brandOptions,
    /** Full group tree for draft drawer category scoping. */
    groupTree: groups,
    setFilter,
    toggleFilterValue,
    removeFilterValue,
    clearAllFilters,
    setPage,
    applyFilters,
    resultCount: pagination.total,
    isLoading:
      brandsQuery.isLoading ||
      groupsQuery.isLoading ||
      (taxonomyReady && productsQuery.isLoading && !productsQuery.data),
    isFetching: productsQuery.isFetching,
    isError: brandsQuery.isError || groupsQuery.isError || productsQuery.isError,
    error: brandsQuery.error || groupsQuery.error || productsQuery.error,
  }
}
