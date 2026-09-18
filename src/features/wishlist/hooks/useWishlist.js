import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useWishlistStore } from '../../../app/store/useWishlistStore'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { useUiStore } from '../../../app/store/useUiStore'
import { useCart } from '../../cart/hooks/useCart'
import { addWishlistItem, removeWishlistItem } from '../api/api'
import { getErrorMessage } from '../../../shared/api/client'

export function useWishlist() {
  const items = useWishlistStore((s) => s.items)
  const addItem = useWishlistStore((s) => s.addItem)
  const removeItem = useWishlistStore((s) => s.removeItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const clear = useWishlistStore((s) => s.clear)
  const hasProduct = useWishlistStore((s) => s.hasProduct)
  const cartAddItem = useCartStore((s) => s.addItem)
  const openWishlist = useUiStore((s) => s.openWishlist)
  const closeWishlist = useUiStore((s) => s.closeWishlist)
  const openCart = useUiStore((s) => s.openCart)
  const { addToCart } = useCart()
  const { pathname } = useLocation()
  const onWishlistPage = pathname === '/wishlist'
  const count = items.length
  const token = useAuthStore((s) => s.token)

  /**
   * @param {string} productId
   */
  function isWishlisted(productId) {
    return hasProduct(productId)
  }

  /**
   * Optimistic toggle. Guests stay local-only; logged-in users hit the API with rollback.
   * @param {object} product
   * @param {{ openDrawer?: boolean }} [options]
   */
  async function toggleWishlist(product, options = {}) {
    const result = toggleItem(product)
    if (result === 'noop') return result

    if (result === 'added') {
      const { openDrawer = !onWishlistPage } = options
      toast.success(`Saved ${product.title} to wishlist`)
      if (openDrawer) openWishlist()
    } else if (result === 'removed') {
      toast.success(`Removed ${product.title} from wishlist`)
    }

    if (!token) return result

    try {
      if (result === 'added') {
        await addWishlistItem(product.id)
      } else if (result === 'removed') {
        await removeWishlistItem(product.id)
      }
    } catch (error) {
      // Rollback optimistic change
      toggleItem(product)
      toast.error(getErrorMessage(error, 'Could not update wishlist'))
      return 'noop'
    }

    return result
  }

  /**
   * @param {string} lineIdOrProductId
   */
  async function removeFromWishlist(lineIdOrProductId) {
    const existing = items.find(
      (item) =>
        item.id === lineIdOrProductId ||
        String(item.productId) === String(lineIdOrProductId),
    )
    removeItem(lineIdOrProductId)
    if (!token || !existing) return

    try {
      await removeWishlistItem(existing.productId)
    } catch (error) {
      addItem({
        id: existing.productId,
        title: existing.title,
        imageUrl: existing.imageUrl,
        href: existing.href,
        currentPrice: existing.unitPrice,
        originalPrice: existing.originalPrice,
        discountPercentage: existing.discountPercentage,
        inStock: existing.inStock,
      })
      toast.error(getErrorMessage(error, 'Could not remove from wishlist'))
    }
  }

  /**
   * @param {object} item
   */
  function toCartProduct(item) {
    return {
      id: item.productId ?? item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      href: item.href,
      currentPrice: item.unitPrice ?? item.currentPrice,
      originalPrice: item.originalPrice,
      discountPercentage: item.discountPercentage,
      inStock: item.inStock,
    }
  }

  /**
   * @param {object} item
   * @param {{ openDrawer?: boolean }} [options]
   */
  function addToCartFromWishlist(item, options = {}) {
    addToCart(toCartProduct(item), 1, { openDrawer: options.openDrawer ?? false })
  }

  /**
   * @param {object} item
   */
  function moveToCart(item) {
    cartAddItem(toCartProduct(item), 1)
    void removeFromWishlist(item.id ?? item.productId)
    toast.success(`Moved ${item.title} to cart`)
    openCart()
  }

  function addAllToCart() {
    if (items.length === 0) return
    items.forEach((item) => {
      cartAddItem(toCartProduct(item), 1)
    })
    toast.success(
      `Added ${items.length} ${items.length === 1 ? 'item' : 'items'} to cart`,
    )
    openCart()
  }

  return {
    items,
    count,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    addToCartFromWishlist,
    moveToCart,
    addAllToCart,
    clear,
    openWishlist,
    closeWishlist,
  }
}
