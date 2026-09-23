import axios from 'axios'
import { apiClient } from '../../../shared/api/client'
import { ORDER_ENDPOINTS } from './endpoints'
import { mapOrderDetail } from './mappers'

/**
 * @param {string | number} addressId
 */
export async function createOrder(addressId) {
  try {
    const { data } = await apiClient.post(ORDER_ENDPOINTS.orders, {
      address_id: Number(addressId),
    })
    return {
      order: data?.data ?? null,
      paymentUrl: data?.meta?.payment_url ?? data?.data?.payment_link_url ?? null,
      message: data?.message ?? null,
      authRequired: Boolean(data?.meta?.auth_required),
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 503) {
      const data = error.response.data
      return {
        order: data?.data ?? null,
        paymentUrl: null,
        message: data?.message ?? 'Zoho Payments authorization required.',
        authRequired: Boolean(data?.meta?.auth_required) || true,
      }
    }
    throw error
  }
}

/**
 * @param {string | number} orderId
 */
export async function fetchOrder(orderId) {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.order(orderId))
  return mapOrderDetail(data?.data)
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
