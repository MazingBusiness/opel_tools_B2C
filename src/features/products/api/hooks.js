import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  buildProductQueryParams,
  fetchBrands,
  fetchCategoryGroups,
  fetchProduct,
  fetchProducts,
  fetchRelatedProducts,
} from './api'

export const catalogQueryKeys = {
  brands: ['catalog', 'brands'],
  categoryGroups: ['catalog', 'category-groups'],
  products: (params) => ['catalog', 'products', params],
  product: (id) => ['catalog', 'product', String(id)],
  related: (categoryId, excludeId) => [
    'catalog',
    'related',
    categoryId ?? null,
    excludeId ?? null,
  ],
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


/**
 * @param {string | undefined} idOrSlug
 */
export function useProductQuery(idOrSlug) {
  return useQuery({
    queryKey: catalogQueryKeys.product(idOrSlug ?? ''),
    enabled: Boolean(idOrSlug),
    queryFn: () => fetchProduct(idOrSlug),
    staleTime: 30_000,
    retry: (failureCount, error) => {
      const status = error?.response?.status
      if (status === 404) return false
      return failureCount < 2
    },
  })
}

/**
 * @param {{ categoryId?: number | null, excludeId?: string, enabled?: boolean }} args
 */
export function useRelatedProductsQuery({
  categoryId = null,
  excludeId = null,
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: catalogQueryKeys.related(categoryId, excludeId),
    enabled: Boolean(enabled && categoryId != null),
    queryFn: () =>
      fetchRelatedProducts({ categoryId, excludeId, perPage: 9 }),
    staleTime: 60_000,
  })
}
