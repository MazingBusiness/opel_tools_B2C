export const MAX_CART_QTY = 99
export const FREE_SHIPPING_THRESHOLD = 2999
export const SHIPPING_FEE = 99
export const GST_RATE = 0.18

/**
 * Qty used for money totals — clamp to stock when line flags excess.
 * @param {{ qty: number, available?: boolean, effectiveQty?: number, qtyExceedsStock?: boolean }} item
 */
function billableQty(item) {
  if (item.available === false) return 0
  if (item.qtyExceedsStock && typeof item.effectiveQty === 'number') {
    return Math.max(0, item.effectiveQty)
  }
  return Math.max(0, item.qty ?? 0)
}

/**
 * @param {Array<{ unitPrice: number, originalPrice?: number, qty: number, available?: boolean, effectiveQty?: number }>} items
 */
export function getCartTotals(items) {
  const list = items ?? []
  const available = list.filter((item) => item.available !== false)
  const itemCount = available.reduce((sum, item) => sum + billableQty(item), 0)
  const subtotal = available.reduce(
    (sum, item) => sum + item.unitPrice * billableQty(item),
    0,
  )
  const originalTotal = available.reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.unitPrice) * billableQty(item),
    0,
  )
  const savings = Math.max(0, originalTotal - subtotal)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const gstIncluded = Math.round((subtotal * GST_RATE) / (1 + GST_RATE))
  const grandTotal = subtotal + shipping

  return {
    itemCount,
    lineCount: available.length,
    subtotal,
    savings,
    shipping,
    amountToFreeShipping,
    gstIncluded,
    grandTotal,
    freeShipping: shipping === 0 && subtotal > 0,
  }
}

/**
 * @param {number} current
 * @param {number} delta
 */
export function clampQty(current, delta = 0) {
  return Math.min(MAX_CART_QTY, Math.max(1, current + delta))
}
