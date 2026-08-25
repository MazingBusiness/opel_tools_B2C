import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiBriefcase, FiHome, FiMapPin, FiPlus, FiZap } from 'react-icons/fi'
import AddressForm from '../../user/components/AddressForm'
import { DEMO_CHECKOUT_ADDRESS } from '../data/demoCheckoutAddress'

/**
 * @param {{
 *   addresses: Array<{
 *     id: string,
 *     name: string,
 *     phone: string,
 *     line1: string,
 *     line2: string,
 *     city: string,
 *     state: string,
 *     pincode: string,
 *     type: 'home' | 'work',
 *     isDefault: boolean,
 *   }>,
 *   selectedAddressId: string,
 *   onSelectAddress: (id: string) => void,
 *   onSaveAddress: (address: object) => { id: string } | null,
 *   onContinue: () => void,
 * }} props
 */
export default function AddressStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSaveAddress,
  onContinue,
}) {
  const [showForm, setShowForm] = useState(false)

  function handleSave(payload) {
    const saved = onSaveAddress(payload)
    if (!saved) {
      toast.error('Could not save address. Please try again.')
      return
    }
    setShowForm(false)
    toast.success('Address saved')
  }

  function handleUseDemoAddress() {
    const saved = onSaveAddress(DEMO_CHECKOUT_ADDRESS)
    if (!saved) {
      toast.error('Could not save demo address. Please try again.')
      return
    }
    setShowForm(false)
    toast.success('Demo address added')
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">Delivery address</h2>
      <p className="mt-1 text-sm text-ink-muted">Choose where we should deliver your order.</p>

      {addresses.length === 0 && !showForm ? (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <FiMapPin className="size-6" aria-hidden />
          </span>
          <p className="font-semibold text-ink">No saved addresses</p>
          <p className="mt-1 text-sm text-ink-muted">Add a delivery address to continue.</p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
            >
              Add address
            </button>
            <button
              type="button"
              onClick={handleUseDemoAddress}
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
            >
              <FiZap className="size-4" aria-hidden />
              Use demo address
            </button>
          </div>
        </div>
      ) : null}

      {addresses.length > 0 && !showForm ? (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Select delivery address</legend>
          {addresses.map((address) => {
            const TypeIcon = address.type === 'work' ? FiBriefcase : FiHome
            const selected = selectedAddressId === address.id

            return (
              <label
                key={address.id}
                className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
                  selected
                    ? 'border-brand bg-brand/5 ring-1 ring-brand/30'
                    : 'border-border hover:border-brand/40'
                }`}
              >
                <input
                  type="radio"
                  name="checkout-address"
                  value={address.id}
                  checked={selected}
                  onChange={() => onSelectAddress(address.id)}
                  className="mt-1 accent-brand"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/5 px-2 py-0.5 text-xs font-semibold capitalize text-brand">
                      <TypeIcon className="size-3.5" aria-hidden />
                      {address.type}
                    </span>
                    {address.isDefault ? (
                      <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink">{address.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ''}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-ink">{address.phone}</p>
                </div>
              </label>
            )
          })}
        </fieldset>
      ) : null}

      {showForm ? (
        <div className="mt-4">
          <AddressForm
            initial={addresses.length === 0 ? DEMO_CHECKOUT_ADDRESS : undefined}
            onCancel={() => setShowForm(false)}
            onSave={handleSave}
          />
        </div>
      ) : addresses.length > 0 ? (
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
          >
            <FiPlus className="size-4" aria-hidden />
            Add new address
          </button>
          <button
            type="button"
            disabled={!selectedAddressId}
            onClick={onContinue}
            className="w-full rounded-md bg-highlight px-8 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[11rem]"
          >
            Continue to review
          </button>
        </div>
      ) : null}
    </div>
  )
}
