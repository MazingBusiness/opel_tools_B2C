import { apiClient } from '../../../shared/api/client'
import { CATALOG_ENDPOINTS } from './endpoints'
import { mapProductDetail, mapProductsIndexResponse } from './mappers'
import { normalizePriceRange } from '../utils/productFilters'

/**
 * @param {Record<string, unknown>} params
 */
export async function fetchProducts(params) {
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.products, { params })
  return mapProductsIndexResponse(data)
}

export async function fetchBrands() {
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.brands)
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  return rows.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug ?? ''),
    label: String(row.name ?? row.slug ?? ''),
    logo: row.logo ? String(row.logo) : '',
  }))
}

export async function fetchCategories() {
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.categories)
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  return rows.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug ?? ''),
    label: String(row.name ?? row.slug ?? ''),
    categoryGroupId:
      row.category_group_id != null ? Number(row.category_group_id) : null,
    parentId: row.parent_id != null ? Number(row.parent_id) : null,
  }))
}

export async function fetchCategoryGroups() {
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.categoryGroups)
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  return rows.map((row) => {
    const categoriesRaw = Array.isArray(row.categories)
      ? row.categories
      : Array.isArray(row.categories?.data)
        ? row.categories.data
        : []
    return {
      id: Number(row.id),
      slug: String(row.slug ?? ''),
      label: String(row.name ?? row.slug ?? ''),
      categories: categoriesRaw.map((cat) => ({
        id: Number(cat.id),
        slug: String(cat.slug ?? ''),
        label: String(cat.name ?? cat.slug ?? ''),
        categoryGroupId: Number(row.id),
        parentId: cat.parent_id != null ? Number(cat.parent_id) : null,
      })),
    }
  })
}

/**
 * Build axios/query params for GET /products from UI filter state + id maps.
 * @param {import('../utils/productFilters.js').ProductFilterParams} filters
 * @param {{
 *   groupIdsBySlug: Map<string, number>,
 *   categoryIdsBySlug: Map<string, number>,
 *   brandIdsBySlug: Map<string, number>,
 * }} maps
 */
export function buildProductQueryParams(filters, maps) {
  /** @type {Record<string, unknown>} */
  const params = {
    page: filters.page || 1,
    per_page: filters.perPage || 24,
  }

  if (filters.q) params.q = filters.q
  const { min, max } = normalizePriceRange(filters.min ?? null, filters.max ?? null)
  if (min != null) params.min = min
  if (max != null) params.max = max
  if (filters.inStock) params.in_stock = 1

  const sort = normalizeApiSort(filters.sort)
  if (sort) params.sort = sort

  const groupIds = (filters.groups ?? [])
    .map((slug) => maps.groupIdsBySlug.get(slug))
    .filter((id) => id != null)
  if (groupIds.length) params.cat_groups = groupIds.join(',')

  const categoryIds = (filters.categories ?? [])
    .map((slug) => maps.categoryIdsBySlug.get(slug))
    .filter((id) => id != null)
  if (categoryIds.length) params.categories = categoryIds.join(',')

  const brandIds = (filters.brands ?? [])
    .map((slug) => maps.brandIdsBySlug.get(slug))
    .filter((id) => id != null)
  if (brandIds.length) params.brands = brandIds.join(',')

  return params
}

/**
 * @param {string | null | undefined} sort
 * @returns {string | null}
 */
export function normalizeApiSort(sort) {
  const map = {
    price_low_to_high: 'price_low_to_high',
    price_high_to_low: 'price_high_to_low',
    new_arrival: 'new_arrival',
    // legacy UI values
    price_asc: 'price_low_to_high',
    price_desc: 'price_high_to_low',
    relevance: null,
    rating: null,
    discount: null,
  }
  if (!sort) return null
  return Object.prototype.hasOwnProperty.call(map, sort) ? map[sort] : null
}


/**
 * GET /api/v1/products/:idOrSlug → PDP view model.
 * @param {string | number} idOrSlug
 */
export async function fetchProduct(idOrSlug) {
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.product(idOrSlug))
  return mapProductDetail(data)
}

/**
 * Related listing by category id (excludes current product client-side).
 * @param {{ categoryId?: number | null, excludeId?: string, perPage?: number }} args
 */
export async function fetchRelatedProducts({
  categoryId = null,
  excludeId = null,
  perPage = 9,
} = {}) {
  /** @type {Record<string, unknown>} */
  const params = { page: 1, per_page: perPage }
  if (categoryId != null) params.categories = String(categoryId)
  const { data } = await apiClient.get(CATALOG_ENDPOINTS.products, { params })
  const mapped = mapProductsIndexResponse(data)
  const exclude = excludeId != null ? String(excludeId) : null
  return mapped.items.filter((item) => (exclude ? item.id !== exclude : true))
}
