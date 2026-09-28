export const ORDER_ENDPOINTS = {
  orders: '/api/v1/orders',
  order: (id) => `/api/v1/orders/${encodeURIComponent(id)}`,
  paymentStatus: (id) => `/api/v1/orders/${encodeURIComponent(id)}/payment-status`,
  track: (number) => `/api/v1/orders/track/${encodeURIComponent(number)}`,
  zohoReturnSync: '/api/v1/payments/zoho/return-sync',
}
