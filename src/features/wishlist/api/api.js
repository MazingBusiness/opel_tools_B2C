import { apiClient } from '../../../shared/api/client'
import { CATALOG_ENDPOINTS } from '../../products/api/endpoints'
import { mapProductsIndexResponse } from '../../products/api/mappers'
import { WISHLIST_ENDPOINTS } from './endpoints'
import { mapWishlistApiItem, mapWishlistListResponse } from './mappers'

export async function fetchWishlist() {
  const { data } = await apiClient.get(WISHLIST_ENDPOINTS.list)
  return mapWishlistListResponse(data)
}

export async function fetchWishlistCount() {
  const { data } = await apiClient.get(WISHLIST_ENDPOINTS.count)
  const count = data?.data?.count
  return Number(count ?? 0)
}

/**
 * @param {string | number} productId
 * @param {string | number | null} [variantId]
 */
export async function addWishlistItem(productId, variantId = null) {
  /** @type {Record<string, unknown>} */
  const body = { product_id: Number(productId) }
  if (variantId != null && variantId !== '') {
    body.variant_id = Number(variantId)
  }
  const { data } = await apiClient.post(WISHLIST_ENDPOINTS.list, body)
  return {
    item: mapWishlistApiItem(data?.data),
    count: Number(data?.meta?.count ?? 0),
    created: Boolean(data?.meta?.created),
  }
}

/**
 * @param {string | number} productId
 */
export async function removeWishlistItem(productId) {
  const { data } = await apiClient.delete(WISHLIST_ENDPOINTS.product(productId))
  return {
    productId: String(data?.data?.product_id ?? productId),
    removed: Boolean(data?.data?.removed),
    count: Number(data?.meta?.count ?? 0),
  }
}

/**
 * Merge guest local ids into server wishlist (server wins on conflict).
 * @param {Array<string | number>} productIds
 */
export async function syncWishlist(productIds) {
  const ids = [...new Set(productIds.map((id) => Number(id)).filter((n) => Number.isFinite(n) && n > 0))]
  const { data } = await apiClient.post(WISHLIST_ENDPOINTS.sync, {
    product_ids: ids,
  })
  return mapWishlistListResponse(data)
}


/**
 * Related products for wishlist "You may also like".
 * Prefers category ids; falls back to group ids.
 * @param {{
 *   categoryIds?: number[],
 *   groupIds?: number[],
 *   excludeIds?: Array<string | number>,
 *   perPage?: number,
 * }} args
 */
export async function fetchWishlistRecommendations({
  categoryIds = [],
  groupIds = [],
  excludeIds = [],
  perPage = 12,
} = {}) {
  const categories = [...new Set(categoryIds.filter((id) => Number.isFinite(id) && id > 0))]
  const groups = [...new Set(groupIds.filter((id) => Number.isFinite(id) && id > 0))]
  if (!categories.length && !groups.length) return []

  /** @type {Record<string, unknown>} */
  const params = { page: 1, per_page: perPage }
  if (categories.length) params.categories = categories.join(',')
  else params.cat_groups = groups.join(',')

  const { data } = await apiClient.get(CATALOG_ENDPOINTS.products, { params })
  const mapped = mapProductsIndexResponse(data)
  const exclude = new Set(excludeIds.map((id) => String(id)))
  return mapped.items
    .filter((item) => !exclude.has(String(item.id)))
    .slice(0, 8)
}
