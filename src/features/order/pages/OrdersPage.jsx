import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchOrders, trackOrder } from '../api/api'
import { orderItemsTotal } from '../utils/orderTotals'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { getErrorMessage } from '../../../shared/api/client'
import { OrderStatusBadge } from '../../user/components/OrderCard'
import { useCurrentProfile } from '../../user/hooks/useCurrentProfile'
import OrderTimeline from '../../user/components/OrderTimeline'

export default function OrdersPage() {
  const { orderId: routeOrderId } = useParams()
  const navigate = useNavigate()
  const { user } = useCurrentProfile()

  const [query, setQuery] = useState(routeOrderId ?? '')
  const [order, setOrder] = useState(/** @type {Awaited<ReturnType<typeof trackOrder>>} */ (null))
  const [lookupError, setLookupError] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [activeOrders, setActiveOrders] = useState(/** @type {NonNullable<Awaited<ReturnType<typeof fetchOrders>>['orders']>} */ ([]))

  useEffect(() => {
    setQuery(routeOrderId ?? '')
  }, [routeOrderId])

  // Public track by number — never auth show for guests / track URL.
  useEffect(() => {
    if (!routeOrderId) {
      setOrder(null)
      setLookupError('')
      setLookingUp(false)
      return
    }
    let cancelled = false
    setLookingUp(true)
    setLookupError('')
    trackOrder(routeOrderId.trim())
      .then((detail) => {
        if (!cancelled) setOrder(detail)
      })
      .catch((err) => {
        if (!cancelled) {
          setOrder(null)
          setLookupError(getErrorMessage(err, 'Order not found.'))
        }
      })
      .finally(() => {
        if (!cancelled) setLookingUp(false)
      })
    return () => {
      cancelled = true
    }
  }, [routeOrderId])

  // Auth list for “your active orders” sidebar only.
  useEffect(() => {
    if (!user) {
      setActiveOrders([])
      return
    }
    let cancelled = false
    fetchOrders()
      .then(({ orders }) => {
        if (cancelled) return
        setActiveOrders(
          orders.filter((o) => o.status === 'processing' || o.status === 'shipped'),
        )
      })
      .catch(() => {
        if (!cancelled) setActiveOrders([])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  function handleSubmit(event) {
    event.preventDefault()
    const id = query.trim()
    if (!id) return
    const target = `/orders/${encodeURIComponent(id)}`
    if (routeOrderId?.toLowerCase() === id.toLowerCase()) {
      document.getElementById('track-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      return
    }
    navigate(target)
  }

  const lookedUp = Boolean(routeOrderId)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Track Order</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter your order number (for example OPL-260922-AB12C) to see live status.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="order-track-query">
          Order number
        </label>
        <input
          id="order-track-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="OPL-…"
          className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-highlight px-5 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          Track
        </button>
      </form>

      {lookingUp ? (
        <p className="mt-8 text-sm text-ink-muted">Looking up order…</p>
      ) : null}

      {lookedUp && !lookingUp && !order ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
          <p className="font-semibold text-ink">No order found</p>
          <p className="mt-1 text-sm text-ink-muted">
            {lookupError || 'Check the order number and try again.'}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link to="/orders" className="text-sm font-semibold text-brand hover:text-brand-dark">
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

      {!routeOrderId && activeOrders.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-ink">Your active orders</h2>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
            {activeOrders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Link
                  to={`/orders/${encodeURIComponent(o.id)}`}
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
 *   order: NonNullable<Awaited<ReturnType<typeof trackOrder>>>,
 *   isLoggedIn: boolean,
 * }} props
 */
function TrackResult({ order, isLoggedIn }) {
  const total =
    order.grandTotal != null && Number.isFinite(order.grandTotal)
      ? order.grandTotal
      : orderItemsTotal(order.items)
  const placed = order.placedAt
    ? new Date(order.placedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—'
  const addr = order.shippingAddress

  return (
    <div id="track-result" className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">{order.id}</h2>
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
          {order.items.map((item) =>
            item.imageUrl ? (
              <img
                key={item.id || item.productId || item.title}
                src={item.imageUrl}
                alt={item.title}
                className="size-16 shrink-0 rounded-md border border-border object-cover"
              />
            ) : null,
          )}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">
          {order.items.map((item) => item.title).join(' · ')}
        </p>
        {total > 0 ? (
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
            <span className="font-bold text-ink">Total</span>
            <span className="font-extrabold text-ink">{formatPrice(total)}</span>
          </div>
        ) : null}
      </section>

      {addr ? (
        <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <h3 className="text-sm font-bold text-ink">Delivering to</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {[addr.city, addr.state].filter(Boolean).join(', ')}
            {addr.pincode ? ` ${addr.pincode}` : ''}
          </p>
        </section>
      ) : null}

      {isLoggedIn ? (
        <Link
          to={`/profile/orders/${encodeURIComponent(order.id)}`}
          className="text-sm font-semibold text-brand hover:text-brand-dark"
        >
          View full order details →
        </Link>
      ) : null}
    </div>
  )
}
