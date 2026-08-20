import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useCartStore } from '../../../app/store/useCartStore'
import { useUiStore } from '../../../app/store/useUiStore'
import { getCartTotals } from '../utils/cartTotals'

export function useCart() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)
  const openCart = useUiStore((s) => s.openCart)
  const closeCart = useUiStore((s) => s.closeCart)
  const { pathname } = useLocation()
  const totals = getCartTotals(items)
  const onCartPage = pathname === '/cart'

  /**
   * @param {object} product
   * @param {number} [qty]
   * @param {{ openDrawer?: boolean }} [options]
   */
  function addToCart(product, qty = 1, options = {}) {
    const { openDrawer = !onCartPage } = options
    addItem(product, qty)
    toast.success(`Added ${qty} × ${product.title} to cart`)
    if (openDrawer) openCart()
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
