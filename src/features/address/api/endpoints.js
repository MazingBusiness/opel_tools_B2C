/** Address API paths (relative to VITE_API_BASE_URL). */

export const ADDRESS_ENDPOINTS = {
  list: '/api/v1/addresses',
  item: (id) => `/api/v1/addresses/${encodeURIComponent(id)}`,
  setDefault: (id) => `/api/v1/addresses/${encodeURIComponent(id)}/default`,
}
