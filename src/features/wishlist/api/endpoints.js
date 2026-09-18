/** Wishlist API paths (relative to VITE_API_BASE_URL). */

export const WISHLIST_ENDPOINTS = {
  list: '/api/v1/wishlist',
  count: '/api/v1/wishlist/count',
  sync: '/api/v1/wishlist/sync',
  product: (productId) =>
    `/api/v1/wishlist/products/${encodeURIComponent(productId)}`,
}
