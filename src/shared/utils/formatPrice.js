/** Format a number as Indian Rupee currency (e.g. ₹1,299). */
export function formatPrice(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '₹0'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
