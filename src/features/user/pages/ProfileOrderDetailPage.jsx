import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useOrdersStore } from '../../../app/store/useOrdersStore'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { orderItemsTotal } from '../data/mockOrders'
import { OrderStatusBadge } from '../components/OrderCard'
import { useCurrentProfile } from '../hooks/useCurrentProfile'

export default function ProfileOrderDetailPage() {
  const { orderId } = useParams()
  const { user } = useCurrentProfile()
  const ensureSeeded = useOrdersStore((s) => s.ensureSeeded)
  const getOrderById = useOrdersStore((s) => s.getOrderById)

  useEffect(() => {
    if (user?.id) ensureSeeded(user.id)
  }, [user?.id, ensureSeeded])

  const order = user?.id ? getOrderById(user.id, orderId ?? '') : null

  if (!order) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
        <p className="font-semibold text-ink">Order not found</p>
        <p className="mt-1 text-sm text-ink-muted">
          This demo order may have been removed.
        </p>
        <Link
          to="/profile/orders"
          className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Back to My orders
        </Link>
      </div>
    )
  }

  const total = orderItemsTotal(order.items)
  const placed = new Date(order.placedAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  const addr = order.shippingAddress

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            {order.id}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Placed {placed}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          {order.status === 'shipped' || order.status === 'processing' ? (
            <Link
              to="/orders"
              className="rounded-md bg-highlight px-3 py-1.5 text-xs font-bold text-cta-foreground transition hover:bg-highlight-dark"
            >
              Track order
            </Link>
          ) : null}
        </div>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Status</h3>
        <ol className="mt-4 space-y-0">
          {order.timeline.map((step, index) => (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`size-3 shrink-0 rounded-full ${
                    step.done ? 'bg-brand' : 'border-2 border-border bg-surface'
                  } ${step.current ? 'ring-4 ring-brand/20' : ''}`}
                />
                {index < order.timeline.length - 1 ? (
                  <span
                    className={`w-px flex-1 min-h-8 ${
                      step.done && order.timeline[index + 1].done
                        ? 'bg-brand'
                        : 'bg-border'
                    }`}
                  />
                ) : null}
              </div>
              <div className="pb-4">
                <p
                  className={`text-sm font-semibold ${
                    step.done ? 'text-ink' : 'text-ink-muted'
                  }`}
                >
                  {step.label}
                </p>
                {step.at ? (
                  <p className="text-xs text-ink-muted">{step.at}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Items</h3>
        <ul className="mt-3 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <img
                src={item.imageUrl}
                alt=""
                className="size-16 shrink-0 rounded-md border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={item.href}
                  className="line-clamp-2 text-sm font-semibold text-ink hover:text-brand"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-xs text-ink-muted">Qty {item.qty}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-ink">
                {formatPrice(item.unitPrice * item.qty)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
          <span className="text-ink-muted">Delivery</span>
          <span className="font-semibold text-success">Free</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="font-bold text-ink">Total</span>
          <span className="font-extrabold text-ink">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs text-ink-muted">Paid via {order.paymentMethod}</p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Delivery address</h3>
        <p className="mt-2 text-sm font-semibold text-ink">{addr.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          {addr.line1}
          {addr.line2 ? `, ${addr.line2}` : ''}
          <br />
          {addr.city}, {addr.state} {addr.pincode}
        </p>
        <p className="mt-1 text-sm text-ink">{addr.phone}</p>
      </section>
    </div>
  )
}
