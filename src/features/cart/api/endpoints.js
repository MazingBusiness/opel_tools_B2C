/** Cart API paths (relative to VITE_API_BASE_URL). */

export const CART_ENDPOINTS = {
  cart: '/api/v1/cart',
  count: '/api/v1/cart/count',
  items: '/api/v1/cart/items',
  item: (id) => `/api/v1/cart/items/${encodeURIComponent(id)}`,
}
