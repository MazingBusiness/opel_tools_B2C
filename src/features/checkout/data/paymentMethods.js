/** @typedef {'upi' | 'card' | 'netbanking'} PaymentMethodId */

export const PAYMENT_METHODS = [
  {
    id: 'upi',
    label: 'UPI',
    orderLabel: 'UPI',
    description: 'Pay via Google Pay, PhonePe, Paytm, or any UPI app',
  },
  {
    id: 'card',
    label: 'Cards',
    orderLabel: 'Credit card',
    description: 'Visa, Mastercard, RuPay, and debit cards',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    orderLabel: 'Net banking',
    description: 'Pay directly from your bank account',
  },
]

export const NET_BANKING_OPTIONS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
]

/**
 * @param {PaymentMethodId} methodId
 */
export function getPaymentMethodLabel(methodId) {
  const method = PAYMENT_METHODS.find((item) => item.id === methodId)
  return method?.orderLabel ?? 'Online payment'
}
