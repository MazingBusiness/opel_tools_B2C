import { Link } from 'react-router-dom'
import { formatPrice } from '../../../shared/utils/formatPrice'
import {
  orderStatusLabel,
  orderStatusStyle,
} from '../../order/utils/orderStatus'
import { orderItemsTotal } from '../../order/utils/orderTotals'

/**
 * @param {{ status: string }} props
 */
export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${orderStatusStyle(status)}`}
    >
      {orderStatusLabel(status)}
    </span>
  )
}

/**
 * @param {{ order: {
 *   id: string,
 *   placedAt: string | null,
 *   status: string,
 *   grandTotal?: number | null,
 *   items: Array<{ id?: string, productId?: string, title: string, imageUrl: string, unitPrice: number, qty: number }>,
 * } }} props
 */
export default function OrderCard({ order }) {
  const total =
    order.grandTotal != null && Number.isFinite(order.grandTotal)
      ? order.grandTotal
      : orderItemsTotal(order.items)
  const placed = order.placedAt
    ? new Date(order.placedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return (
    <article className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink">{order.id}</p>
          <p className="mt-0.5 text-xs text-ink-muted">Placed {placed}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {order.items.map((item) => (
          <img
            key={item.id || item.productId || item.title}
            src={item.imageUrl}
            alt={item.title}
            className="size-16 shrink-0 rounded-md border border-border object-cover"
          />
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-muted">
        {order.items.map((item) => item.title).join(' · ')}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <p className="text-sm font-bold text-ink">{formatPrice(total)}</p>
        <div className="flex gap-2">
          <Link
            to={`/profile/orders/${encodeURIComponent(order.id)}`}
            className="rounded-md border-2 border-brand px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
          >
            View details
          </Link>
          {order.status === 'shipped' || order.status === 'processing' ? (
            <Link
              to={`/orders/${encodeURIComponent(order.id)}`}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Track
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}
