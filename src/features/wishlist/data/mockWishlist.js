import { getProductById } from '../../products/data/productCatalog'

/**
 * @param {object} product
 */
export function productToWishlistItem(product) {
  if (!product) return null
  return {
    id: `wish-${product.id}`,
    productId: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    href: product.href ?? `/products/${product.id}`,
    unitPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage ?? 0,
    inStock: product.inStock !== false,
  }
}

/**
 * @param {string} productId
 */
function item(productId) {
  return productToWishlistItem(getProductById(productId))
}

/** First-visit dummy wishlist (not re-applied after the user clears). */
export function createSeedWishlistItems() {
  return [item('pt-5'), item('ac-1'), item('sg-1')].filter(Boolean)
}

export const WISHLIST_REC_IDS = ['pt-1', 'pt-2', 'ht-1', 'pt-10']
