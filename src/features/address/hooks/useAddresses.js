import toast from 'react-hot-toast'
import { useAddressStore } from '../../../app/store/useAddressStore'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useUiStore } from '../../../app/store/useUiStore'
import {
  createAddress,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  setDefaultAddress as setDefaultAddressApi,
  fetchAddresses,
} from '../api/api'
import { getErrorMessage } from '../../../shared/api/client'

export function useAddresses() {
  const items = useAddressStore((s) => s.items)
  const replaceItems = useAddressStore((s) => s.replaceItems)
  const serverHydrated = useAddressStore((s) => s.serverHydrated)
  const token = useAuthStore((s) => s.token)
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  const defaultAddress = items.find((item) => item.isDefault) ?? items[0] ?? null

  function requireLogin() {
    toast.error('Please sign in to manage addresses')
    openAuthModal()
  }

  async function refresh() {
    const next = await fetchAddresses()
    replaceItems(next)
    return next
  }

  /**
   * @param {Record<string, unknown>} payload
   */
  async function addAddress(payload) {
    if (!token) {
      requireLogin()
      return null
    }
    try {
      const created = await createAddress(payload)
      await refresh()
      toast.success('Address saved')
      return created
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not save address'))
      return null
    }
  }

  /**
   * @param {string} id
   * @param {Record<string, unknown>} payload
   */
  async function updateAddress(id, payload) {
    if (!token) {
      requireLogin()
      return null
    }
    try {
      const updated = await updateAddressApi(id, payload)
      await refresh()
      toast.success('Address updated')
      return updated
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update address'))
      return null
    }
  }

  /**
   * @param {string} id
   */
  async function deleteAddress(id) {
    if (!token) {
      requireLogin()
      return false
    }
    try {
      await deleteAddressApi(id)
      await refresh()
      toast.success('Address removed')
      return true
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not remove address'))
      return false
    }
  }

  /**
   * @param {string} id
   */
  async function setDefaultAddress(id) {
    if (!token) {
      requireLogin()
      return null
    }
    try {
      const updated = await setDefaultAddressApi(id)
      await refresh()
      toast.success('Default address updated')
      return updated
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not set default address'))
      return null
    }
  }

  return {
    items,
    addresses: items,
    defaultAddress,
    serverHydrated,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refresh,
  }
}
