/**
 * @param {Array<{ unitPrice?: number, qty?: number }>} items
 */
export function orderItemsTotal(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.qty) || 0), 0)
}
