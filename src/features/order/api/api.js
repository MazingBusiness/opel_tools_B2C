import axios from 'axios'
import { apiClient } from '../../../shared/api/client'
import { ORDER_ENDPOINTS } from './endpoints'
import { mapOrderDetail, mapOrderListItem, mapOrderTrack } from './mappers'

/**
 * @param {string | number} addressId
 * @param {{ paymentMethod?: 'zoho' | 'cod' }} [opts]
 */
export async function createOrder(addressId, opts = {}) {
  const paymentMethod = opts.paymentMethod === 'cod' ? 'cod' : 'zoho'
  try {
    const { data } = await apiClient.post(ORDER_ENDPOINTS.orders, {
      address_id: Number(addressId),
      payment_method: paymentMethod,
    })
    return {
      order: mapOrderDetail(data?.data) ?? data?.data ?? null,
      paymentUrl: data?.meta?.payment_url ?? data?.data?.payment_link_url ?? null,
      message: data?.message ?? null,
      authRequired: Boolean(data?.meta?.auth_required),
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 503) {
      const data = error.response.data
      return {
        order: mapOrderDetail(data?.data) ?? data?.data ?? null,
        paymentUrl: null,
        message: data?.message ?? 'Zoho Payments authorization required.',
        authRequired: Boolean(data?.meta?.auth_required) || true,
      }
    }
    throw error
  }
}

/**
 * Auth list — never use public track here.
 * @param {{ page?: number }} [opts]
 */
export async function fetchOrders(opts = {}) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.orders, {
    params: { page: opts.page ?? 1 },
  })
  const rows = Array.isArray(data?.data) ? data.data : []
  return {
    orders: rows.map(mapOrderListItem).filter(Boolean),
    meta: data?.meta ?? null,
  }
}

/**
 * Auth show by OPL-* or numeric db id.
 * @param {string | number} orderId
 */
export async function fetchOrder(orderId) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.order(orderId))
  return mapOrderDetail(data?.data)
}

/**
 * Public track by number only.
 * @param {string} number
 */
export async function trackOrder(number) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.track(number))
  return mapOrderTrack(data?.data)
}

/**
 * @param {string | number} orderId
 */
export async function fetchPaymentStatus(orderId) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.paymentStatus(orderId))
  return data?.data ?? null
}

/**
 * @param {Record<string, string>} params
 */
export async function syncZohoReturn(params) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.zohoReturnSync, { params })
  return data?.data ?? null
}
