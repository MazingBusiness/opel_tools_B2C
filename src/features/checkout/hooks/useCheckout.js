import { useCallback, useMemo, useState } from 'react'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { useOrdersStore } from '../../../app/store/useOrdersStore'
import { useProfileStore } from '../../../app/store/useProfileStore'
import { getCartTotals } from '../../cart/utils/cartTotals'
import { simulateZohoPayment } from '../api/zohoPayments'
import { getPaymentMethodLabel } from '../data/paymentMethods'
import { createOrder } from '../utils/createOrder'

/** @typedef {'address' | 'review' | 'payment' | 'success'} CheckoutStep */

export const CHECKOUT_STEPS = [
  { id: 'address', label: 'Delivery' },
  { id: 'review', label: 'Review' },
  { id: 'payment', label: 'Payment' },
  { id: 'success', label: 'Done' },
]

export function useCheckout() {
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const addOrder = useOrdersStore((s) => s.addOrder)
  const profile = useProfileStore((s) => (user ? s.byUserId[user.id] ?? null : null))
  const addAddress = useProfileStore((s) => s.addAddress)
  const ensureProfile = useProfileStore((s) => s.ensureProfile)

  const addresses = profile?.addresses ?? []
  const defaultAddress = addresses.find((item) => item.isDefault) ?? addresses[0] ?? null

  const [step, setStep] = useState(/** @type {CheckoutStep} */ ('address'))
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? '')
  const [paymentMethod, setPaymentMethod] = useState(/** @type {'upi' | 'card' | 'netbanking'} */ ('upi'))
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(/** @type {import('../utils/createOrder.js').ReturnType<typeof createOrder> | null} */ (null))

  const totals = useMemo(() => getCartTotals(items), [items])

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  )

  const stepIndex = CHECKOUT_STEPS.findIndex((item) => item.id === step)

  const goToStep = useCallback((nextStep) => {
    setStep(nextStep)
    setPaymentError('')
  }, [])

  const goNext = useCallback(() => {
    const currentIndex = CHECKOUT_STEPS.findIndex((item) => item.id === step)
    const next = CHECKOUT_STEPS[currentIndex + 1]
    if (next) setStep(/** @type {CheckoutStep} */ (next.id))
  }, [step])

  const goBack = useCallback(() => {
    const currentIndex = CHECKOUT_STEPS.findIndex((item) => item.id === step)
    const prev = CHECKOUT_STEPS[currentIndex - 1]
    if (prev) setStep(/** @type {CheckoutStep} */ (prev.id))
  }, [step])

  /**
   * @param {import('../../../app/store/useProfileStore.js').ProfileAddress extends infer T ? Omit<T, 'id'> : never} address
   */
  const saveNewAddress = useCallback(
    (address) => {
      if (!user) return null
      ensureProfile(user)
      const isFirstAddress = (useProfileStore.getState().byUserId[user.id]?.addresses.length ?? 0) === 0
      addAddress(user.id, {
        ...address,
        isDefault: isFirstAddress ? true : address.isDefault,
      })
      const updated = useProfileStore.getState().byUserId[user.id]
      const newest = updated?.addresses[updated.addresses.length - 1]
      if (newest) setSelectedAddressId(newest.id)
      return newest ?? null
    },
    [user, addAddress, ensureProfile],
  )

  const processPayment = useCallback(async () => {
    if (!user || !selectedAddress || items.length === 0) return

    setIsProcessing(true)
    setPaymentError('')

    const result = await simulateZohoPayment({
      amount: totals.grandTotal,
      method: paymentMethod,
    })

    setIsProcessing(false)

    if (!result.success) {
      setPaymentError(result.error ?? 'Payment failed. Please try again.')
      return
    }

    const order = createOrder({
      items,
      address: selectedAddress,
      paymentMethod: getPaymentMethodLabel(paymentMethod),
      paymentRef: result.transactionId,
    })

    addOrder(user.id, order)
    clearCart()
    setPlacedOrder(order)
    setStep('success')
  }, [user, selectedAddress, items, totals.grandTotal, paymentMethod, addOrder, clearCart])

  return {
    step,
    stepIndex,
    items,
    totals,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    paymentError,
    placedOrder,
    goToStep,
    goNext,
    goBack,
    saveNewAddress,
    processPayment,
  }
}
