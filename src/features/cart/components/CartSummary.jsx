import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartTotals'

/**
 * @param {{
 *   totals: ReturnType<import('../utils/cartTotals').getCartTotals>,
 *   variant?: 'page' | 'drawer',
 *   onCheckout?: () => void,
 *   showCheckoutButton?: boolean,
 * }} props
 */
export default function CartSummary({
  totals,
  variant = 'page',
  onCheckout,
  showCheckoutButton = true,
}) {
  const navigate = useNavigate()

  function handleCheckout() {
    if (onCheckout) {
      onCheckout()
      return
    }
    navigate('/checkout')
  }

  const disabled = totals.itemCount === 0

  return (
    <aside className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">Order summary</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
      </p>

      <dl className="mt-4 space-y-2 text-sm">
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
            {totals.shipping === 0 && totals.subtotal > 0 ? 'Free' : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">GST (18% included)</dt>
          <dd className="font-semibold text-ink">{formatPrice(totals.gstIncluded)}</dd>
        </div>
      </dl>

      {totals.amountToFreeShipping > 0 && totals.subtotal > 0 ? (
        <p className="mt-3 rounded-md bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
          Add {formatPrice(totals.amountToFreeShipping)} more for free delivery (orders above{' '}
          {formatPrice(FREE_SHIPPING_THRESHOLD)}).
        </p>
      ) : null}

      {totals.freeShipping ? (
        <p className="mt-3 rounded-md bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
          You qualify for free delivery.
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold text-ink">Total</span>
        <span className="text-lg font-extrabold text-ink">{formatPrice(totals.grandTotal)}</span>
      </div>
      <p className="mt-1 text-[11px] text-ink-muted">Inclusive of GST. Shipping extra when applicable.</p>

      {showCheckoutButton ? (
      <button
        type="button"
        disabled={disabled}
        onClick={handleCheckout}
        className="mt-4 w-full rounded-md bg-highlight py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to checkout
      </button>
      ) : null}

      {variant === 'page' ? (
        <Link
          to="/products"
          className="mt-3 block text-center text-sm font-semibold text-brand hover:underline"
        >
          Continue shopping
        </Link>
      ) : null}
    </aside>
  )
}
