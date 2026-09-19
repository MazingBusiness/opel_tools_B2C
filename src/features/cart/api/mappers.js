/**
 * Map CartItemResource → Zustand cart line.
 * @param {Record<string, unknown>} row
 */
export function mapCartApiItem(row) {
  if (!row) return null
  const product = row.product && typeof row.product === 'object' ? row.product : null
  const variant = row.variant && typeof row.variant === 'object' ? row.variant : null
  const available = row.available !== false && product && variant

  const current = Number(variant?.unit_price ?? 0)
  const originalRaw = variant?.mrp ?? variant?.list_price ?? variant?.unit_price
  const original = Number(originalRaw ?? current)
  const discountPercentage =
    original > current && original > 0
      ? Math.round(((original - current) / original) * 100)
      : 0

  const productId = String(row.product_id ?? product?.id ?? '')

  return {
    id: String(row.id),
    productId,
    variantId: row.variant_id != null ? String(row.variant_id) : '',
    title: available ? String(product.name ?? '') : 'Unavailable item',
    imageUrl: available && product.thumbnail_img ? String(product.thumbnail_img) : '',
    href: productId ? `/products/${productId}` : '/products',
    unitPrice: current,
    originalPrice: original > 0 ? original : current,
    discountPercentage,
    qty: Number(row.qty ?? 1),
    available: Boolean(available),
    inStock: Boolean(row.in_stock),
    minQty: Number(row.min_qty ?? 1),
    maxQty: Number(row.max_qty ?? 99),
    qtyExceedsStock: Boolean(row.qty_exceeds_stock),
    effectiveQty: Number(row.effective_qty ?? row.qty ?? 0),
    lineTotal: Number(row.line_total ?? 0),
  }
}

/**
 * @param {unknown} response
 */
export function mapCartResponse(response) {
  const body = response && typeof response === 'object' ? response : {}
  const data = Array.isArray(body.data) ? body.data : []
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : {}
  const items = data.map(mapCartApiItem).filter(Boolean)
  return {
    items,
    meta: {
      itemCount: Number(meta.item_count ?? 0),
      lineCount: Number(meta.line_count ?? 0),
      subtotal: Number(meta.subtotal ?? 0),
      savings: Number(meta.savings ?? 0),
    },
  }
}
