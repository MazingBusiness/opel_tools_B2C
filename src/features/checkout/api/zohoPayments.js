/**
 * Placeholder for future Zoho Payments integration.
 *
 * Real integration will use Zoho Checkout Session or Payment Widget API:
 * - Create payment session on backend with order amount + customer details
 * - Load Zoho hosted payment page / embedded widget
 * - Handle webhook / redirect for payment confirmation
 *
 * @see https://www.zoho.com/in/payments/developer/
 */
export function initZohoPayments() {
  // TODO: Initialize Zoho Payments SDK when backend is ready
  return null
}

/**
 * Simulates a Zoho Payments transaction for demo purposes.
 *
 * @param {{ amount: number, method: string }} params
 * @returns {Promise<{ success: boolean, transactionId: string, error?: string }>}
 */
export function simulateZohoPayment({ amount, method }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.05
      if (success) {
        resolve({
          success: true,
          transactionId: `ZPAY-${Date.now()}-${method.toUpperCase()}`,
        })
        return
      }
      resolve({
        success: false,
        transactionId: '',
        error: 'Payment was declined. Please try again or use a different method.',
      })
    }, 2000)
  })
}
