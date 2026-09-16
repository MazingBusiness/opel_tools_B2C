import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  buildProductQueryParams,
  fetchBrands,
  fetchCategoryGroups,
  fetchProducts,
} from './api'

export const catalogQueryKeys = {
  brands: ['catalog', 'brands'],
  categoryGroups: ['catalog', 'category-groups'],
  products: (params) => ['catalog', 'products', params],
}

export function useBrandsQuery() {
  return useQuery({
    queryKey: catalogQueryKeys.brands,
    queryFn: fetchBrands,
    staleTime: 5 * 60_000,
  })
}

export function useCategoryGroupsQuery() {
  return useQuery({
    queryKey: catalogQueryKeys.categoryGroups,
    queryFn: fetchCategoryGroups,
    staleTime: 5 * 60_000,
  })
}

/**
 * @param {import('../utils/productFilters.js').ProductFilterParams} filters
 * @param {{
 *   groupIdsBySlug: Map<string, number>,
 *   categoryIdsBySlug: Map<string, number>,
 *   brandIdsBySlug: Map<string, number>,
 * }} maps
 * @param {boolean} enabled
 */
export function useProductsQuery(filters, maps, enabled = true) {
  const resolvedParams = useMemo(
    () => buildProductQueryParams(filters, maps),
    [filters, maps],
  )

  return useQuery({
    queryKey: catalogQueryKeys.products(resolvedParams),
    enabled,
    placeholderData: (previous) => previous,
    queryFn: () => fetchProducts(resolvedParams),
    staleTime: 30_000,
  })
}
