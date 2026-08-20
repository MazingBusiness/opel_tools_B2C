import { getProductById } from '../../products/data/productCatalog'

/**
 * @param {object} product
 * @param {number} qty
 */
export function productToCartLine(product, qty = 1) {
  if (!product) return null
  return {
    id: `cart-${product.id}`,
    productId: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    href: product.href ?? `/products/${product.id}`,
    unitPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage ?? 0,
    qty,
  }
}

/**
 * @param {string} productId
 * @param {number} qty
 */
function line(productId, qty) {
  return productToCartLine(getProductById(productId), qty)
}

/** First-visit dummy cart (not re-applied after the user clears). */
export function createSeedCartLines() {
  return [line('pt-1', 1), line('pt-2', 1), line('ht-1', 1)].filter(Boolean)
}

export const CART_REC_IDS = ['pt-5', 'pt-10', 'ac-1', 'sg-1']
