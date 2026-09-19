import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useCartStore } from '../../../app/store/useCartStore'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useUiStore } from '../../../app/store/useUiStore'
import { getCartTotals } from '../utils/cartTotals'
import {
  addCartItem,
  updateCartItemQty,
  removeCartItem,
  clearCart as clearCartApi,
  fetchCart,
} from '../api/api'
import { getErrorMessage } from '../../../shared/api/client'

export function useCart() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const setQtyLocal = useCartStore((s) => s.setQty)
  const removeItemLocal = useCartStore((s) => s.removeItem)
  const clearLocal = useCartStore((s) => s.clear)
  const replaceItems = useCartStore((s) => s.replaceItems)
  const openCartDrawer = useUiStore((s) => s.openCart)
  const closeCart = useUiStore((s) => s.closeCart)
  const openAuthModal = useUiStore((s) => s.openAuthModal)
  const token = useAuthStore((s) => s.token)
  const { pathname } = useLocation()
  const totals = getCartTotals(items)
  const onCartPage = pathname === '/cart'

  function requireLogin() {
    toast.error('Please sign in to use your cart')
    openAuthModal()
  }

  function openCart() {
    if (!token) {
      requireLogin()
      return
    }
    openCartDrawer()
  }

  /**
   * @param {object} product
   * @param {number} [qty]
   * @param {{ openDrawer?: boolean, skipToast?: boolean }} [options]
   * @returns {Promise<boolean>} true when the server accept succeeded
   */
  async function addToCart(product, qty = 1, options = {}) {
    if (!token) {
      requireLogin()
      return false
    }

    const { openDrawer = !onCartPage, skipToast = false } = options
    const snapshot = useCartStore.getState().items.map((item) => ({ ...item }))
    addItem(product, qty)
    if (!skipToast) toast.success(`Added ${qty} × ${product.title} to cart`)
    if (openDrawer) openCartDrawer()

    try {
      await addCartItem(product.id, qty)
      const { items: next, meta } = await fetchCart()
      replaceItems(next, meta)
      return true
    } catch (error) {
      replaceItems(snapshot)
      toast.error(getErrorMessage(error, 'Could not add to cart'))
      return false
    }
  }

  /**
   * @param {string} lineId
   * @param {number} qty
   */
  async function setQty(lineId, qty) {
    if (!token) {
      requireLogin()
      return
    }
    const snapshot = useCartStore.getState().items.map((item) => ({ ...item }))
    setQtyLocal(lineId, qty)
    try {
      await updateCartItemQty(lineId, qty)
      const { items: next, meta } = await fetchCart()
      replaceItems(next, meta)
    } catch (error) {
      replaceItems(snapshot)
      toast.error(getErrorMessage(error, 'Could not update quantity'))
    }
  }

  /**
   * @param {string} lineId
   */
  async function removeItem(lineId) {
    if (!token) {
      requireLogin()
      return
    }
    const snapshot = useCartStore.getState().items.map((item) => ({ ...item }))
    removeItemLocal(lineId)
    try {
      await removeCartItem(lineId)
      const { items: next, meta } = await fetchCart()
      replaceItems(next, meta)
    } catch (error) {
      replaceItems(snapshot)
      toast.error(getErrorMessage(error, 'Could not remove item'))
    }
  }

  async function clear() {
    if (!token) {
      requireLogin()
      return
    }
    const snapshot = useCartStore.getState().items.map((item) => ({ ...item }))
    clearLocal()
    try {
      await clearCartApi()
      replaceItems([], {
        itemCount: 0,
        lineCount: 0,
        subtotal: 0,
        savings: 0,
      })
    } catch (error) {
      replaceItems(snapshot)
      toast.error(getErrorMessage(error, 'Could not clear cart'))
    }
  }

  return {
    items,
    totals,
    addToCart,
    setQty,
    removeItem,
    clear,
    openCart,
    closeCart,
  }
}
