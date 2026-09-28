export const ORDER_STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending_payment', label: 'Awaiting payment' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'failed', label: 'Failed' },
]

export const ORDER_STATUS_STYLES = {
  pending_payment: 'bg-amber-50 text-amber-800',
  processing: 'bg-brand/10 text-brand',
  shipped: 'bg-highlight/20 text-ink',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-red-50 text-red-600',
  failed: 'bg-red-50 text-red-600',
  paid: 'bg-brand/10 text-brand',
}

export const ORDER_STATUS_LABELS = {
  pending_payment: 'Awaiting payment',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
  paid: 'Paid',
}

/**
 * @param {string | undefined | null} status
 */
export function orderStatusLabel(status) {
  if (!status) return 'Unknown'
  return ORDER_STATUS_LABELS[status] ?? status.replace(/_/g, ' ')
}

/**
 * @param {string | undefined | null} status
 */
export function orderStatusStyle(status) {
  if (!status) return 'bg-surface-muted text-ink-muted'
  return ORDER_STATUS_STYLES[status] ?? 'bg-surface-muted text-ink-muted'
}

/**
 * @param {string | undefined | null} paymentStatus
 * @param {string | undefined | null} [paymentMethod]
 */
export function paymentStatusLabel(paymentStatus, paymentMethod) {
  if (paymentMethod === 'cod') {
    return 'Cash on delivery'
  }
  switch (paymentStatus) {
    case 'paid':
      return 'Zoho Payments'
    case 'pending':
      return 'Payment pending'
    case 'failed':
      return 'Payment failed'
    case 'unpaid':
      return 'Unpaid'
    default:
      return paymentStatus ? String(paymentStatus) : '—'
  }
}
