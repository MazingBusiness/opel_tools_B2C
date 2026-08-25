import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { orderItemsTotal } from '../../user/data/mockOrders'

/**
 * @param {{
 *   order: {
 *     id: string,
 *     paymentMethod: string,
 *     paymentRef?: string | null,
 *     items: Array<{ unitPrice: number, qty: number }>,
 *   },
 * }} props
 */
export default function SuccessStep({ order }) {
  const total = orderItemsTotal(order.items)

  return (
    <div className="rounded-lg border border-border bg-surface p-6 text-center sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <FiCheckCircle className="size-9" aria-hidden />
      </span>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
        Order confirmed!
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Thank you for your purchase. We&apos;ve received your order and will start processing it
        shortly.
      </p>

      <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-lg border border-border bg-surface-muted p-4 text-left text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">Order ID</dt>
          <dd className="font-bold text-ink">{order.id}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">Amount paid</dt>
          <dd className="font-bold text-ink">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">Payment method</dt>
          <dd className="font-semibold text-ink">{order.paymentMethod}</dd>
        </div>
        {order.paymentRef ? (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Transaction ref</dt>
            <dd className="font-mono text-xs text-ink">{order.paymentRef}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 border-t border-border pt-2">
          <dt className="text-ink-muted">Estimated delivery</dt>
          <dd className="font-semibold text-ink">3–5 business days</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          to={`/profile/orders/${order.id}`}
          className="inline-flex items-center justify-center rounded-md bg-highlight px-6 py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          View order
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-md border-2 border-brand px-6 py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
