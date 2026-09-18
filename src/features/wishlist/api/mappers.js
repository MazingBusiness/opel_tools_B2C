/**
 * Map WishlistItemResource → Zustand wishlist line.
 * Skips unavailable / unpublished products (flagged by API).
 * @param {Record<string, unknown>} row
 */
export function mapWishlistApiItem(row) {
  if (!row || row.available === false || !row.product) return null
  const product = /** @type {Record<string, unknown>} */ (row.product)
  const current = Number(product.unit_price ?? 0)
  const originalRaw = product.mrp ?? product.list_price ?? product.unit_price
  const original = Number(originalRaw ?? current)
  const discountPercentage =
    original > current && original > 0
      ? Math.round(((original - current) / original) * 100)
      : 0
  const productId = String(row.product_id ?? product.id ?? '')

  const category =
    product.category && typeof product.category === 'object' ? product.category : null
  const group =
    product.group && typeof product.group === 'object' ? product.group : null

  return {
    id: String(row.id ?? `wish-${productId}`),
    productId,
    title: String(product.name ?? ''),
    imageUrl: product.thumbnail_img ? String(product.thumbnail_img) : '',
    href: `/products/${productId}`,
    unitPrice: current,
    originalPrice: original > 0 ? original : current,
    discountPercentage,
    inStock: Boolean(product.in_stock),
    categoryId: category?.id != null ? Number(category.id) : null,
    categorySlug: category?.slug ? String(category.slug) : '',
    groupId: group?.id != null ? Number(group.id) : null,
    groupSlug: group?.slug ? String(group.slug) : '',
  }
}

/**
 * @param {unknown} response
 */
export function mapWishlistListResponse(response) {
  const body = response && typeof response === 'object' ? response : {}
  const data = Array.isArray(body.data) ? body.data : []
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : {}
  const items = data.map(mapWishlistApiItem).filter(Boolean)
  return {
    items,
    count: Number(meta.count ?? items.length),
  }
}
