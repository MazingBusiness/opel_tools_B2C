import { apiClient } from '../../../shared/api/client'
import { CART_ENDPOINTS } from './endpoints'
import { mapCartApiItem, mapCartResponse } from './mappers'

export async function fetchCart() {
  const { data } = await apiClient.get(CART_ENDPOINTS.cart)
  return mapCartResponse(data)
}

export async function fetchCartCount() {
  const { data } = await apiClient.get(CART_ENDPOINTS.count)
  return {
    itemCount: Number(data?.data?.item_count ?? 0),
    lineCount: Number(data?.data?.line_count ?? 0),
  }
}

/**
 * @param {string | number} productId
 * @param {number} [qty]
 * @param {string | number | null} [variantId]
 */
export async function addCartItem(productId, qty = 1, variantId = null) {
  /** @type {Record<string, unknown>} */
  const body = {
    product_id: Number(productId),
    qty: Number(qty) || 1,
  }
  if (variantId != null && variantId !== '') {
    body.variant_id = Number(variantId)
  }
  const { data } = await apiClient.post(CART_ENDPOINTS.items, body)
  return {
    item: mapCartApiItem(data?.data),
    meta: mapCartResponse(data).meta,
    created: Boolean(data?.meta?.created),
  }
}

/**
 * @param {string | number} itemId
 * @param {number} qty
 */
export async function updateCartItemQty(itemId, qty) {
  const { data } = await apiClient.patch(CART_ENDPOINTS.item(itemId), {
    qty: Number(qty),
  })
  return {
    item: mapCartApiItem(data?.data),
    meta: mapCartResponse(data).meta,
  }
}

/**
 * @param {string | number} itemId
 */
export async function removeCartItem(itemId) {
  const { data } = await apiClient.delete(CART_ENDPOINTS.item(itemId))
  return {
    id: String(data?.data?.id ?? itemId),
    removed: Boolean(data?.data?.removed),
    meta: mapCartResponse(data).meta,
  }
}

export async function clearCart() {
  const { data } = await apiClient.delete(CART_ENDPOINTS.cart)
  return mapCartResponse(data)
}
