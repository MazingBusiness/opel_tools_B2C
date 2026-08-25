import { Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import { formatPrice } from '../../../shared/utils/formatPrice'
import CheckoutLineItem from './CheckoutLineItem'

/**
 * @param {{
 *   items: Array<object>,
 *   totals: ReturnType<import('../../cart/utils/cartTotals.js').getCartTotals>,
 *   address: {
 *     name: string,
 *     phone: string,
 *     line1: string,
 *     line2: string,
 *     city: string,
 *     state: string,
 *     pincode: string,
 *   } | null,
 *   onChangeAddress: () => void,
 *   onContinue: () => void,
 * }} props
 */
export default function ReviewStep({ items, totals, address, onChangeAddress, onContinue }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <FiMapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-ink">
                Deliver to
              </h2>
              {address ? (
                <>
                  <p className="mt-1 text-sm font-semibold text-ink">{address.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ''}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-ink">{address.phone}</p>
                </>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onChangeAddress}
            className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Change
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-lg font-extrabold tracking-tight text-ink">Order items</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
        </p>
        <div className="mt-3">
          {items.map((item) => (
            <CheckoutLineItem key={item.id} item={item} />
          ))}
        </div>

        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="font-semibold text-ink">{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.savings > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Savings</dt>
              <dd className="font-semibold text-success">−{formatPrice(totals.savings)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">Shipping</dt>
            <dd className="font-semibold text-ink">
              {totals.shipping === 0 && totals.subtotal > 0
                ? 'Free'
                : formatPrice(totals.shipping)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">GST (18% included)</dt>
            <dd className="font-semibold text-ink">{formatPrice(totals.gstIncluded)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-border pt-2">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="text-lg font-extrabold text-ink">{formatPrice(totals.grandTotal)}</dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-ink-muted">
        By placing this order, you agree to our{' '}
        <Link to="/terms" className="font-semibold text-brand hover:underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link to="/returns" className="font-semibold text-brand hover:underline">
          Returns policy
        </Link>
        .
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onChangeAddress}
          className="rounded-md border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-md bg-highlight py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark sm:flex-initial sm:px-8"
        >
          Continue to payment
        </button>
      </div>
    </div>
  )
}
