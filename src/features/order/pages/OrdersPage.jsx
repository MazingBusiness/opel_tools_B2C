import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useOrdersStore } from '../../../app/store/useOrdersStore'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { orderItemsTotal } from '../../user/data/mockOrders'
import { OrderStatusBadge } from '../../user/components/OrderCard'
import { useCurrentProfile } from '../../user/hooks/useCurrentProfile'
import OrderTimeline from '../../user/components/OrderTimeline'

/** Demo order ID shown in the empty lookup form (exists in mockOrders). */
const DEMO_ORDER_ID = 'OPL-26091'

export default function OrdersPage() {
  const { orderId: routeOrderId } = useParams()
  const navigate = useNavigate()
  const { user } = useCurrentProfile()
  const findOrderById = useOrdersStore((s) => s.findOrderById)
  const ensureSeeded = useOrdersStore((s) => s.ensureSeeded)
  const getOrders = useOrdersStore((s) => s.getOrders)
  // Subscribe so lookup re-runs after persist rehydration fills byUserId
  useOrdersStore((s) => s.byUserId)

  const [query, setQuery] = useState(routeOrderId ?? DEMO_ORDER_ID)

  useEffect(() => {
    if (user?.id) ensureSeeded(user.id)
  }, [user?.id, ensureSeeded])

  useEffect(() => {
    setQuery(routeOrderId ?? DEMO_ORDER_ID)
  }, [routeOrderId])

  const order = routeOrderId ? findOrderById(routeOrderId) : null
  const lookedUp = Boolean(routeOrderId)

  const userOrders = user?.id ? getOrders(user.id) : []
  const trackableOrders = userOrders.filter(
    (o) => o.status === 'processing' || o.status === 'shipped',
  )

  function handleSubmit(event) {
    event.preventDefault()
    const id = query.trim()
    if (!id) return
    const target = `/orders/${encodeURIComponent(id)}`
    if (routeOrderId?.toLowerCase() === id.toLowerCase()) {
      // Already on this order URL — scroll results into view
      document.getElementById('track-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    navigate(target)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Track Order</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter your order ID to see live fulfillment status.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Order ID
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={DEMO_ORDER_ID}
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-highlight px-5 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark sm:shrink-0"
        >
          Track
        </button>
      </form>

      {lookedUp && !order ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
          <p className="font-semibold text-ink">Order not found</p>
          <p className="mt-1 text-sm text-ink-muted">
            Check the ID and try again, or open My orders if you&apos;re signed
            in.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/orders"
              className="text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Clear search
            </Link>
            {user ? (
              <Link
                to="/profile/orders"
                className="text-sm font-semibold text-brand hover:text-brand-dark"
              >
                My orders
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {order ? <TrackResult order={order} isLoggedIn={Boolean(user)} /> : null}

      {!routeOrderId && trackableOrders.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-ink">Your active orders</h2>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
            {trackableOrders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{o.id}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {o.items.map((item) => item.title).join(' · ')}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

/**
 * @param {{
 *   order: import('../../user/data/mockOrders.js').mockOrders[number],
 *   isLoggedIn: boolean,
 * }} props
 */
function TrackResult({ order, isLoggedIn }) {
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
    <div id="track-result" className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            {order.id}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Placed {placed}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Status</h3>
        <div className="mt-4">
          <OrderTimeline timeline={order.timeline} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Items</h3>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {order.items.map((item) => (
            <img
              key={item.productId}
              src={item.imageUrl}
              alt={item.title}
              className="size-16 shrink-0 rounded-md border border-border object-cover"
            />
          ))}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">
          {order.items.map((item) => item.title).join(' · ')}
        </p>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
          <span className="font-bold text-ink">Total</span>
          <span className="font-extrabold text-ink">{formatPrice(total)}</span>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-bold text-ink">Delivering to</h3>
        <p className="mt-2 text-sm text-ink-muted">
          {addr.city}, {addr.state} {addr.pincode}
        </p>
      </section>

      {isLoggedIn ? (
        <Link
          to={`/profile/orders/${order.id}`}
          className="text-sm font-semibold text-brand hover:text-brand-dark"
        >
          View full order details →
        </Link>
      ) : null}
    </div>
  )
}
