import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useWishlistStore } from '../../../app/store/useWishlistStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { useUiStore } from '../../../app/store/useUiStore'
import { useCart } from '../../cart/hooks/useCart'

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

  /**
   * @param {string} productId
   */
  function isWishlisted(productId) {
    return hasProduct(productId)
  }

  /**
   * @param {object} product
   * @param {{ openDrawer?: boolean }} [options]
   */
  function toggleWishlist(product, options = {}) {
    const result = toggleItem(product)
    if (result === 'added') {
      const { openDrawer = !onWishlistPage } = options
      toast.success(`Saved ${product.title} to wishlist`)
      if (openDrawer) openWishlist()
    } else if (result === 'removed') {
      toast.success(`Removed ${product.title} from wishlist`)
    }
    return result
  }

  /**
   * @param {string} lineIdOrProductId
   */
  function removeFromWishlist(lineIdOrProductId) {
    removeItem(lineIdOrProductId)
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
    removeItem(item.id ?? item.productId)
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
    addItem,
    removeFromWishlist,
    clear,
    addToCartFromWishlist,
    moveToCart,
    addAllToCart,
    openWishlist,
    closeWishlist,
  }
}
