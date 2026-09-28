import { FiLock, FiLoader, FiCreditCard } from 'react-icons/fi'
import { formatPrice } from '../../../shared/utils/formatPrice'

/**
 * @typedef {'zoho' | 'cod'} PaymentMethodChoice
 */

/**
 * @param {{
 *   totals: ReturnType<import('../../cart/utils/cartTotals.js').getCartTotals>,
 *   paymentMethod: PaymentMethodChoice,
 *   onPaymentMethodChange: (method: PaymentMethodChoice) => void,
 *   isProcessing: boolean,
 *   paymentError: string,
 *   onPay: () => void,
 *   onBack: () => void,
 * }} props
 */
export default function PaymentStep({
  totals,
  paymentMethod,
  onPaymentMethodChange,
  isProcessing,
  paymentError,
  onPay,
  onBack,
}) {
  const isCod = paymentMethod === 'cod'

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-bold text-ink">Choose payment method</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
          <button
            type="button"
            role="radio"
            aria-checked={paymentMethod === 'zoho'}
            disabled={isProcessing}
            onClick={() => onPaymentMethodChange('zoho')}
            className={`flex items-start gap-3 rounded-md border-2 p-3 text-left transition disabled:opacity-50 ${
              paymentMethod === 'zoho'
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-brand/40'
            }`}
          >
            <FiCreditCard className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <span>
              <span className="block text-sm font-bold text-ink">Online payment</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Pay securely via Zoho (UPI, cards, net banking)
              </span>
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isCod}
            disabled={isProcessing}
            onClick={() => onPaymentMethodChange('cod')}
            className={`flex items-start gap-3 rounded-md border-2 p-3 text-left transition disabled:opacity-50 ${
              isCod ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/40'
            }`}
          >
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-base font-bold leading-none text-brand" aria-hidden>₹</span>
            <span>
              <span className="block text-sm font-bold text-ink">Cash on delivery</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                Pay with cash when your order arrives
              </span>
            </span>
          </button>
        </div>

        {!isCod ? (
          <div className="mt-4 flex items-start gap-3 rounded-md border border-brand/20 bg-brand/5 p-3">
            <FiLock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-bold text-ink">Secured by Zoho Payments</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                You will complete payment on Zoho’s secure page (sandbox). Status confirms after
                return.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-border bg-surface-muted p-3">
            <p className="text-sm text-ink-muted">
              Your order will be confirmed immediately. Please keep the exact amount ready for the
              delivery partner.
            </p>
          </div>
        )}

        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border pt-4">
          <span className="text-sm font-semibold text-ink">
            {isCod ? 'Amount due on delivery' : 'Amount due'}
          </span>
          <span className="text-lg font-extrabold text-ink">{formatPrice(totals.grandTotal)}</span>
        </div>

        {paymentError ? (
          <p className="mt-4 text-sm font-medium text-red-600" role="alert">
            {paymentError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="rounded-md border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onPay}
            disabled={isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-highlight py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial sm:px-8"
          >
            {isProcessing ? (
              <>
                <FiLoader className="size-4 animate-spin" aria-hidden />
                {isCod ? 'Placing order…' : 'Processing payment…'}
              </>
            ) : isCod ? (
              <>Place order · {formatPrice(totals.grandTotal)}</>
            ) : (
              <>Pay {formatPrice(totals.grandTotal)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
