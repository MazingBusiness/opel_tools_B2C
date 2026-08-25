import { FiLock, FiLoader } from 'react-icons/fi'
import { formatPrice } from '../../../shared/utils/formatPrice'
import { INPUT_CLASS, LABEL_CLASS } from '../../user/utils/profileHelpers'
import { NET_BANKING_OPTIONS, PAYMENT_METHODS } from '../data/paymentMethods'

/**
 * @param {{
 *   totals: ReturnType<import('../../cart/utils/cartTotals.js').getCartTotals>,
 *   paymentMethod: 'upi' | 'card' | 'netbanking',
 *   onPaymentMethodChange: (method: 'upi' | 'card' | 'netbanking') => void,
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
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3 rounded-md border border-brand/20 bg-brand/5 p-3">
          <FiLock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="text-sm font-bold text-ink">Secured by Zoho Payments</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Simulated payment flow for demo. No real charges will be made.
            </p>
          </div>
        </div>

        <div
          className="mt-4 flex gap-1 rounded-lg border border-border bg-surface-muted p-1"
          role="tablist"
          aria-label="Payment method"
        >
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              role="tab"
              aria-selected={paymentMethod === method.id}
              onClick={() => onPaymentMethodChange(/** @type {'upi' | 'card' | 'netbanking'} */ (method.id))}
              className={`flex-1 rounded-md px-2 py-2 text-xs font-bold transition sm:text-sm ${
                paymentMethod === method.id
                  ? 'bg-surface text-brand shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {PAYMENT_METHODS.map((method) =>
            paymentMethod === method.id ? (
              <div key={method.id}>
                <p className="text-sm text-ink-muted">{method.description}</p>

                {method.id === 'upi' ? (
                  <label className="mt-4 block">
                    <span className={LABEL_CLASS}>UPI ID</span>
                    <input
                      className={INPUT_CLASS}
                      placeholder="yourname@upi"
                      defaultValue="customer@upi"
                      readOnly
                      aria-readonly="true"
                    />
                  </label>
                ) : null}

                {method.id === 'card' ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className={LABEL_CLASS}>Card number</span>
                      <input
                        className={INPUT_CLASS}
                        placeholder="4111 1111 1111 1111"
                        defaultValue="4111 1111 1111 1111"
                        readOnly
                        aria-readonly="true"
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>Expiry</span>
                      <input
                        className={INPUT_CLASS}
                        placeholder="MM / YY"
                        defaultValue="12 / 28"
                        readOnly
                        aria-readonly="true"
                      />
                    </label>
                    <label className="block">
                      <span className={LABEL_CLASS}>CVV</span>
                      <input
                        className={INPUT_CLASS}
                        placeholder="123"
                        defaultValue="123"
                        readOnly
                        aria-readonly="true"
                      />
                    </label>
                    <p className="sm:col-span-2 text-xs text-ink-muted">
                      Real integration will use Zoho hosted payment fields for PCI compliance.
                    </p>
                  </div>
                ) : null}

                {method.id === 'netbanking' ? (
                  <label className="mt-4 block">
                    <span className={LABEL_CLASS}>Select bank</span>
                    <select className={INPUT_CLASS} defaultValue={NET_BANKING_OPTIONS[0]} disabled>
                      {NET_BANKING_OPTIONS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
            ) : null,
          )}
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
                Processing payment…
              </>
            ) : (
              <>Pay {formatPrice(totals.grandTotal)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
