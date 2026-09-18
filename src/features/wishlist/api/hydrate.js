import { useAuthStore } from '../../../app/store/useAuthStore'
import { useWishlistStore } from '../../../app/store/useWishlistStore'
import { fetchWishlist, syncWishlist } from './api'

/**
 * After login / session bootstrap: merge guest local ids, then replace store from server.
 */
export async function hydrateWishlistFromServer() {
  const token = useAuthStore.getState().token
  if (!token) return

  const localIds = useWishlistStore
    .getState()
    .items.map((item) => Number(item.productId))
    .filter((id) => Number.isFinite(id) && id > 0)

  if (localIds.length > 0) {
    try {
      await syncWishlist(localIds)
    } catch {
      // Still try to load server list if sync fails.
    }
  }

  try {
    const { items } = await fetchWishlist()
    useWishlistStore.getState().replaceItems(items)
  } catch {
    // Leave current local items (including guest merges not yet replaced).
  }
}

export function clearWishlistLocal() {
  useWishlistStore.getState().clear()
}
