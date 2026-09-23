import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiMapPin } from 'react-icons/fi'
import { fetchOrder, fetchPaymentStatus, syncZohoReturn } from '../../order/api/api'
import { clearCartLocal } from '../../cart/api/hydrate'
import { clearCart as clearCartApi } from '../../cart/api/api'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { GST_RATE } from '../../cart/utils/cartTotals'
import CheckoutLineItem from '../components/CheckoutLineItem'

const CONFIRMED_ORDER_KEY = 'opel_confirmed_order_id'

/**
 * Zoho redirects here with query params. We sync once then poll payment status.
 * Order id may be in sessionStorage from checkout start.
 */
export default function PaymentReturnPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('pending')
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(/** @type {Awaited<ReturnType<typeof fetchOrder>>} */ (null))
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const pendingId = sessionStorage.getItem('opel_pending_order_id')
    const storedId = pendingId || sessionStorage.getItem(CONFIRMED_ORDER_KEY)
    const paymentLinkId = params.get('payment_link_id') || ''
    const zohoStatus = params.get('status') || ''
    const paymentId = params.get('payment_id') || ''

    async function run() {
      try {
        if (paymentLinkId) {
          await syncZohoReturn({
            payment_link_id: paymentLinkId,
            status: zohoStatus,
            payment_id: paymentId,
          })
        }

        const orderId = storedId
        if (!orderId) {
          if (cancelled) return
          setStatus(zohoStatus === 'failed' || zohoStatus === 'failure' ? 'failed' : 'unknown')
          return
        }

        for (let i = 0; i < 12; i += 1) {
          const data = await fetchPaymentStatus(orderId)
          if (cancelled) return
          if (data?.number) setOrderNumber(data.number)
          if (data?.payment_status === 'paid') {
            if (!cancelled) setStatus('paid')
            sessionStorage.setItem(CONFIRMED_ORDER_KEY, String(orderId))
            try {
              const detail = await fetchOrder(orderId)
              if (!cancelled && detail) {
                setOrder(detail)
                if (detail.number) setOrderNumber(detail.number)
              }
            } catch {
              // Order number from payment status still shows.
            }
            if (pendingId) {
              try {
                await clearCartApi()
              } catch {
                // Local clear still runs so badge drops.
              }
              clearCartLocal()
              sessionStorage.removeItem('opel_pending_order_id')
            }
            return
          }
          if (data?.payment_status === 'failed') {
            setStatus('failed')
            return
          }
          await new Promise((r) => setTimeout(r, 1500))
        }
        setStatus('pending')
      } catch {
        if (!cancelled) {
          setError('Could not confirm payment yet. Check Orders shortly.')
          setStatus('pending')
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [params])

  const actions = (
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link
        to="/profile/orders"
        className="rounded-md bg-highlight px-5 py-2.5 text-sm font-bold text-cta-foreground"
      >
        View orders
      </Link>
      <Link to="/products" className="text-sm font-semibold text-brand hover:underline">
        Continue shopping
      </Link>
    </div>
  )

  if (status !== 'paid') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {status === 'failed' ? 'Payment failed' : 'Confirming payment…'}
        </h1>
        {orderNumber ? (
          <p className="mt-2 text-sm text-ink-muted">Order {orderNumber}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <p className="mt-4 text-sm text-ink-muted">
          {status === 'failed'
            ? 'You can retry from cart/checkout.'
            : 'If you just paid, this can take a few seconds. Webhook confirmation comes later in staging.'}
        </p>
        {actions}
      </div>
    )
  }

  const placedLabel = order?.placedAt
    ? new Date(order.placedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''
  const address = order?.address
  const itemCount = order?.itemCount ?? order?.items.length ?? 0
  const gst =
    order?.subtotal != null
      ? Math.round((order.subtotal * GST_RATE) / (1 + GST_RATE))
      : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <FiCheckCircle className="size-9" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
          Payment successful
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Thanks — we will process your order shortly.
        </p>
        {orderNumber ? (
          <p className="mt-3 text-sm font-bold text-ink">Order {orderNumber}</p>
        ) : null}
        {placedLabel ? (
          <p className="mt-1 text-xs text-ink-muted">Placed {placedLabel}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </header>

      {order?.items.length ? (
        <section className="mt-8 rounded-lg border border-border bg-surface p-4 sm:p-5">
          <h2 className="text-lg font-extrabold tracking-tight text-ink">Order items</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <div className="mt-3">
            {order.items.map((item) => (
              <CheckoutLineItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {order && (order.subtotal != null || order.shipping != null || gst != null || order.grandTotal != null) ? (
        <section className="mt-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
          <h2 className="text-lg font-extrabold tracking-tight text-ink">Payment summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {order.subtotal != null ? (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatPrice(order.subtotal)}</dd>
              </div>
            ) : null}
            {order.shipping != null ? (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Shipping</dt>
                <dd className="font-semibold text-ink">
                  {order.shipping === 0 && (order.subtotal ?? 0) > 0
                    ? 'Free'
                    : formatPrice(order.shipping)}
                </dd>
              </div>
            ) : null}
            {gst != null ? (
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">GST (18% included)</dt>
                <dd className="font-semibold text-ink">{formatPrice(gst)}</dd>
              </div>
            ) : null}
            {order.grandTotal != null ? (
              <div className="flex justify-between gap-3 border-t border-border pt-2">
                <dt className="font-semibold text-ink">Amount paid</dt>
                <dd className="text-lg font-extrabold text-ink">{formatPrice(order.grandTotal)}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {address ? (
        <section className="mt-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-start gap-2">
            <FiMapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-ink">Deliver to</h2>
              {address.name ? (
                <p className="mt-1 text-sm font-semibold text-ink">{address.name}</p>
              ) : null}
              <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
                {address.city || address.state || address.pincode ? (
                  <>
                    <br />
                    {[address.city, address.state].filter(Boolean).join(', ')} {address.pincode}
                  </>
                ) : null}
              </p>
              {address.phone ? <p className="mt-1 text-sm text-ink">{address.phone}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      {actions}
    </div>
  )
}
