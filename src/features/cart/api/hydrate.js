import toast from 'react-hot-toast'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { getErrorMessage } from '../../../shared/api/client'
import { fetchCart, fetchCartCount } from './api'

function markCartPersistHydrated() {
  if (!useCartStore.getState().hasHydrated) {
    useCartStore.setState({ hasHydrated: true, hasSeeded: true })
  }
}

/** Wait until zustand persist has finished so we never lose a race with rehydrate. */
function waitForCartPersist() {
  if (useCartStore.getState().hasHydrated || useCartStore.persist.hasHydrated()) {
    markCartPersistHydrated()
    return Promise.resolve()
  }
  // Token / serverMeta already merged means localStorage hydrate applied even if
  // persist.hasHydrated() stuck false after an onRehydrateStorage throw.
  const cart = useCartStore.getState()
  if (useAuthStore.getState().token || cart.serverMeta != null) {
    markCartPersistHydrated()
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    useCartStore.persist.onFinishHydration(() => {
      markCartPersistHydrated()
      resolve(undefined)
    })
    if (useCartStore.persist.hasHydrated()) {
      markCartPersistHydrated()
      resolve(undefined)
    }
  })
}

/** Coalesce overlapping bootstrap + drawer hydrates. */
let hydratePromise = /** @type {Promise<void> | null} */ (null)

/**
 * After login / session bootstrap: replace local cart from server (no guest cart merge).
 * Count endpoint first so the header badge paints before full lines load.
 */
export async function hydrateCartFromServer() {
  if (hydratePromise) return hydratePromise
  hydratePromise = hydrateCartFromServerImpl().finally(() => {
    hydratePromise = null
  })
  return hydratePromise
}

async function hydrateCartFromServerImpl() {
  const token = useAuthStore.getState().token
  if (!token) return

  await waitForCartPersist()

  try {
    const count = await fetchCartCount()
    const prev = useCartStore.getState().serverMeta
    useCartStore.setState({
      serverMeta: {
        itemCount: count.itemCount,
        lineCount: count.lineCount,
        subtotal: prev?.subtotal ?? 0,
        savings: prev?.savings ?? 0,
      },
    })

    const { items, meta } = await fetchCart()
    useCartStore.getState().replaceItems(items, meta)
  } catch (error) {
    console.error('[cart] hydrateCartFromServer failed', error)
    toast.error(getErrorMessage(error, 'Could not load your cart'))
  }
}

export function clearCartLocal() {
  useCartStore.getState().clear()
}
