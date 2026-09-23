import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { useAddresses } from '../../address/hooks/useAddresses'
import { getCartTotals } from '../../cart/utils/cartTotals'
import { createOrder as createOrderApi } from '../../order/api/api'
import { getErrorMessage } from '../../../shared/api/client'

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
  const { addresses, defaultAddress, addAddress } = useAddresses()

  const [step, setStep] = useState(/** @type {CheckoutStep} */ ('address'))
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(/** @type {'upi' | 'card' | 'netbanking'} */ ('upi'))
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(/** @type {import('../utils/createOrder.js').ReturnType<typeof createOrder> | null} */ (null))

  useEffect(() => {
    if (!selectedAddressId && defaultAddress?.id) {
      setSelectedAddressId(defaultAddress.id)
    }
  }, [defaultAddress?.id, selectedAddressId])

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
   * @param {Omit<import('../../../app/store/useAddressStore.js').Address extends infer T ? T : never, 'id'>} address
   */
  const saveNewAddress = useCallback(
    async (address) => {
      if (!user) return null
      const created = await addAddress({
        ...address,
        isDefault: addresses.length === 0 ? true : Boolean(address.isDefault),
      })
      if (created?.id) setSelectedAddressId(created.id)
      return created
    },
    [user, addAddress, addresses.length],
  )

  const processPayment = useCallback(async () => {
    if (!user || !selectedAddress || items.length === 0) return

    setIsProcessing(true)
    setPaymentError('')

    try {
      const { order, paymentUrl, message, authRequired } = await createOrderApi(
        selectedAddress.id,
      )

      if (!order?.id) {
        setPaymentError(message || 'Could not create order.')
        setIsProcessing(false)
        return
      }

      if (authRequired || !paymentUrl) {
        setPaymentError(
          message ||
            'Zoho Payments needs a one-time OAuth connect on the server. Ask Code Dev for the oauth/redirect URL.',
        )
        setIsProcessing(false)
        return
      }

      sessionStorage.setItem('opel_pending_order_id', String(order.id))
      // Do not clear cart until payment is confirmed paid (cancel/fail keeps cart).
      window.location.assign(paymentUrl)
    } catch (error) {
      setIsProcessing(false)
      setPaymentError(getErrorMessage(error, 'Could not start payment. Please try again.'))
    }
  }, [user, selectedAddress, items.length])


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
