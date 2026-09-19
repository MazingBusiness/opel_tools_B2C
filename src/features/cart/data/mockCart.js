/**
 * @param {object} product
 * @param {number} qty
 */
export function productToCartLine(product, qty = 1) {
  if (!product) return null
  return {
    id: `cart-${product.id}`,
    productId: String(product.id),
    title: product.title,
    imageUrl: product.imageUrl,
    href: product.href ?? `/products/${product.id}`,
    unitPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage ?? 0,
    qty,
    available: true,
    inStock: product.inStock !== false,
  }
}

/** Guest/mock seed disabled — cart requires login. */
export function createSeedCartLines() {
  return []
}

export const CART_REC_IDS = []
