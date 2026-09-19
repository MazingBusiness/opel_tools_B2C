import { useAuthStore } from '../../../app/store/useAuthStore'
import { useAddressStore } from '../../../app/store/useAddressStore'
import { fetchAddresses } from './api'

export async function hydrateAddressesFromServer() {
  const token = useAuthStore.getState().token
  if (!token) return

  try {
    const items = await fetchAddresses()
    useAddressStore.getState().replaceItems(items)
  } catch (error) {
    console.error('[addresses] hydrate failed', error)
  }
}

export function clearAddressesLocal() {
  useAddressStore.getState().clear()
}
