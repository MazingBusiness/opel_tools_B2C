/**
 * Map OrderResource → confirmation view model.
 * Rows the payload omits stay null so the page can skip them.
 * @param {Record<string, unknown> | null | undefined} row
 */
export function mapOrderDetail(row) {
  if (!row || typeof row !== 'object') return null

  const rawItems = Array.isArray(row.items) ? row.items : []
  const items = rawItems.map(mapOrderItem).filter(Boolean)
  const address = mapShippingAddress(row.shipping_address)

  return {
    id: String(row.number ?? row.id ?? ''),
    number: String(row.number ?? row.id ?? ''),
    placedAt: typeof row.placed_at === 'string' ? row.placed_at : null,
    itemCount: finiteNumber(row.item_count) ?? items.reduce((sum, item) => sum + item.qty, 0),
    subtotal: finiteNumber(row.subtotal),
    shipping: finiteNumber(row.shipping_fee),
    grandTotal: finiteNumber(row.grand_total),
    address,
    items,
  }
}

/**
 * @param {unknown} row
 */
function mapOrderItem(row) {
  if (!row || typeof row !== 'object') return null
  const item = /** @type {Record<string, unknown>} */ (row)
  const productId = item.product_id != null ? String(item.product_id) : ''
  const unitPrice = finiteNumber(item.unit_price) ?? 0
  const qty = finiteNumber(item.qty) ?? 0

  return {
    id: String(item.id ?? `${productId}-${qty}`),
    title: String(item.title ?? ''),
    imageUrl: item.image_url ? String(item.image_url) : '',
    href: typeof item.href === 'string' && item.href ? item.href : productId ? `/products/${productId}` : '/products',
    unitPrice,
    qty,
  }
}

/**
 * @param {unknown} row
 */
function mapShippingAddress(row) {
  if (!row || typeof row !== 'object') return null
  const address = /** @type {Record<string, unknown>} */ (row)
  const mapped = {
    name: text(address.name),
    phone: text(address.phone),
    line1: text(address.line1),
    line2: text(address.line2),
    city: text(address.city),
    state: text(address.state),
    pincode: text(address.pincode),
  }
  const hasContent = Object.values(mapped).some(Boolean)
  return hasContent ? mapped : null
}

/**
 * @param {unknown} value
 */
function text(value) {
  if (value == null) return ''
  return String(value)
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function finiteNumber(value) {
  if (value == null || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}
