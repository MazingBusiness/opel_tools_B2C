import { apiClient } from '../../../shared/api/client'
import { ADDRESS_ENDPOINTS } from './endpoints'
import { mapAddressApiItem, toAddressApiBody } from './mappers'

export async function fetchAddresses() {
  const { data } = await apiClient.get(ADDRESS_ENDPOINTS.list)
  const rows = Array.isArray(data?.data) ? data.data : []
  return rows.map(mapAddressApiItem).filter(Boolean)
}

/**
 * @param {Record<string, unknown>} address
 */
export async function createAddress(address) {
  const { data } = await apiClient.post(ADDRESS_ENDPOINTS.list, toAddressApiBody(address))
  return mapAddressApiItem(data?.data)
}

/**
 * @param {string | number} id
 * @param {Record<string, unknown>} patch
 */
export async function updateAddress(id, patch) {
  const { data } = await apiClient.patch(
    ADDRESS_ENDPOINTS.item(id),
    toAddressApiBody(patch, { forUpdate: true }),
  )
  return mapAddressApiItem(data?.data)
}

/**
 * @param {string | number} id
 */
export async function deleteAddress(id) {
  const { data } = await apiClient.delete(ADDRESS_ENDPOINTS.item(id))
  return {
    id: String(data?.data?.id ?? id),
    removed: Boolean(data?.data?.removed),
  }
}

/**
 * @param {string | number} id
 */
export async function setDefaultAddress(id) {
  const { data } = await apiClient.post(ADDRESS_ENDPOINTS.setDefault(id))
  return mapAddressApiItem(data?.data)
}
