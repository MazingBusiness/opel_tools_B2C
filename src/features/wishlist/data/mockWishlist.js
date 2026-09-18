/**
 * @param {object} product
 */
export function productToWishlistItem(product) {
  if (!product) return null
  return {
    id: `wish-${product.id}`,
    productId: String(product.id),
    title: product.title,
    imageUrl: product.imageUrl,
    href: product.href ?? `/products/${product.id}`,
    unitPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage ?? 0,
    inStock: product.inStock !== false,
    categoryId: product.categoryId != null ? Number(product.categoryId) : null,
    categorySlug: product.categorySlug ? String(product.categorySlug) : '',
    groupId: product.groupId != null ? Number(product.groupId) : null,
    groupSlug: product.groupSlug ? String(product.groupSlug) : '',
  }
}

/** First-visit dummy wishlist — disabled now that API wishlist exists. */
export function createSeedWishlistItems() {
  // return []
  return []
}

/** @deprecated mock recs — wishlist page uses live catalog recommendations */
export const WISHLIST_REC_IDS = []
