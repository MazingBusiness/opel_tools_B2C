import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import CartSummary from '../../cart/components/CartSummary'
import { useCurrentProfile } from '../../user/hooks/useCurrentProfile'
import AddressStep from '../components/AddressStep'
import CheckoutStepper from '../components/CheckoutStepper'
import PaymentStep from '../components/PaymentStep'
import ReviewStep from '../components/ReviewStep'
import SuccessStep from '../components/SuccessStep'
import { useCheckout } from '../hooks/useCheckout'

export default function CheckoutPage() {
  const { user } = useCurrentProfile()
  const checkout = useCheckout()

  const {
    step,
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
    saveNewAddress,
    processPayment,
  } = checkout

  const isSuccess = step === 'success'
  const showEmptyCartRedirect = items.length === 0 && !isSuccess

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddr = addresses.find((item) => item.isDefault) ?? addresses[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    }
  }, [addresses, selectedAddressId, setSelectedAddressId])

  if (showEmptyCartRedirect) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
        className="px-0"
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Checkout</h1>
        {user ? (
          <p className="text-sm text-ink-muted">Signed in as {user.identifier}</p>
        ) : null}
      </div>

      <CheckoutStepper
        currentStep={step}
        onStepClick={(stepId) => {
          if (stepId === 'success') return
          goToStep(/** @type {'address' | 'review' | 'payment'} */ (stepId))
        }}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div>
          {step === 'address' ? (
            <AddressStep
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onSaveAddress={saveNewAddress}
              onContinue={goNext}
            />
          ) : null}

          {step === 'review' ? (
            <ReviewStep
              items={items}
              totals={totals}
              address={selectedAddress}
              onChangeAddress={() => goToStep('address')}
              onContinue={goNext}
            />
          ) : null}

          {step === 'payment' ? (
            <PaymentStep
              totals={totals}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              isProcessing={isProcessing}
              paymentError={paymentError}
              onPay={processPayment}
              onBack={() => goToStep('review')}
            />
          ) : null}

          {step === 'success' && placedOrder ? <SuccessStep order={placedOrder} /> : null}
        </div>

        {!isSuccess ? (
          <div className="lg:sticky lg:top-[calc(var(--header-offset,120px)+1rem)]">
            <CartSummary totals={totals} variant="page" showCheckoutButton={false} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
