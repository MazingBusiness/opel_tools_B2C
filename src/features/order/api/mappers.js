/**
 * Map OrderResource / track DTO → FE order view model.
 * `id` is always the OPL-* number string.
 * @param {Record<string, unknown> | null | undefined} row
 * @param {{ publicTrack?: boolean }} [opts]
 */
export function mapOrderDetail(row, opts = {}) {
  if (!row || typeof row !== 'object') return null

  const rawItems = Array.isArray(row.items) ? row.items : []
  const items = rawItems.map(mapOrderItem).filter(Boolean)
  const address = mapShippingAddress(row.shipping_address, Boolean(opts.publicTrack))
  const number = String(row.number ?? row.id ?? '')
  const timeline = Array.isArray(row.timeline)
    ? row.timeline.map(mapTimelineStep).filter(Boolean)
    : []

  const grandTotal =
    finiteNumber(row.grand_total) ??
    (items.length ? items.reduce((s, i) => s + i.unitPrice * i.qty, 0) : null)

  return {
    id: number,
    number,
    dbId: row.db_id != null ? Number(row.db_id) : null,
    placedAt:
      typeof row.placed_at === 'string'
        ? row.placed_at
        : typeof row.created_at === 'string'
          ? row.created_at
          : null,
    status: typeof row.status === 'string' ? row.status : 'pending_payment',
    paymentStatus: typeof row.payment_status === 'string' ? row.payment_status : null,
    paymentMethod:
      typeof row.payment_method === 'string' && row.payment_method
        ? row.payment_method
        : 'zoho',
    currency: typeof row.currency === 'string' ? row.currency : 'INR',
    itemCount: finiteNumber(row.item_count) ?? items.reduce((sum, item) => sum + item.qty, 0),
    subtotal: finiteNumber(row.subtotal),
    shipping: finiteNumber(row.shipping_fee),
    grandTotal,
    paidAt: typeof row.paid_at === 'string' ? row.paid_at : null,
    shippingAddress: address,
    timeline,
    items,
  }
}

/**
 * @param {unknown} row
 */
export function mapOrderListItem(row) {
  return mapOrderDetail(/** @type {Record<string, unknown>} */ (row), { publicTrack: false })
}

/**
 * @param {unknown} row
 */
export function mapOrderTrack(row) {
  return mapOrderDetail(/** @type {Record<string, unknown>} */ (row), { publicTrack: true })
}

/**
 * @param {unknown} row
 */
function mapOrderItem(row) {
  if (!row || typeof row !== 'object') return null
  const item = /** @type {Record<string, unknown>} */ (row)
  const productId = item.product_id != null ? String(item.product_id) : ''
  const unitPrice = finiteNumber(item.unit_price) ?? finiteNumber(item.unitPrice) ?? 0
  const qty = finiteNumber(item.qty) ?? 0
  const imageUrl =
    (item.image_url ? String(item.image_url) : '') ||
    (item.imageUrl ? String(item.imageUrl) : '')

  return {
    id: String(item.id ?? `${productId}-${qty}`),
    productId,
    title: String(item.title ?? ''),
    imageUrl,
    href:
      typeof item.href === 'string' && item.href
        ? item.href
        : productId
          ? `/products/${productId}`
          : '/products',
    unitPrice,
    qty,
  }
}

/**
 * @param {unknown} row
 * @param {boolean} publicTrack
 */
function mapShippingAddress(row, publicTrack) {
  if (!row || typeof row !== 'object') return null
  const address = /** @type {Record<string, unknown>} */ (row)
  const mapped = {
    name: text(address.name),
    phone: text(address.phone),
    line1: publicTrack ? '' : text(address.line1),
    line2: publicTrack ? '' : text(address.line2),
    city: text(address.city),
    state: text(address.state),
    pincode: text(address.pincode),
  }
  const hasContent = Object.values(mapped).some(Boolean)
  return hasContent ? mapped : null
}

/**
 * @param {unknown} step
 */
function mapTimelineStep(step) {
  if (!step || typeof step !== 'object') return null
  const row = /** @type {Record<string, unknown>} */ (step)
  return {
    key: String(row.key ?? ''),
    label: String(row.label ?? ''),
    at: typeof row.at === 'string' ? row.at : '',
    done: Boolean(row.done),
    current: Boolean(row.current),
  }
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
