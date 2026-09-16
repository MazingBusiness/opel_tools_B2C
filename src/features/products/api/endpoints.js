/** Catalog API paths (relative to VITE_API_BASE_URL). */

export const CATALOG_ENDPOINTS = {
  products: '/api/v1/products',
  product: (idOrSlug) => `/api/v1/products/${encodeURIComponent(idOrSlug)}`,
  brands: '/api/v1/brands',
  categories: '/api/v1/categories',
  categoryGroups: '/api/v1/category-groups',
}
