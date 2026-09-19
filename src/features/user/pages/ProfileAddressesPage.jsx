import { useState } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { useCurrentProfile } from '../hooks/useCurrentProfile'
import { useAddresses } from '../../address/hooks/useAddresses'
import AddressCard from '../components/AddressCard'
import AddressForm from '../components/AddressForm'

export default function ProfileAddressesPage() {
  const { user } = useCurrentProfile()
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses()

  const [mode, setMode] = useState(/** @type {'closed' | 'add' | string} */ ('closed'))
  const editing = addresses.find((item) => item.id === mode)

  async function handleSave(payload) {
    if (!user) return
    if (editing) {
      const ok = await updateAddress(editing.id, payload)
      if (ok) setMode('closed')
    } else {
      const ok = await addAddress(payload)
      if (ok) setMode('closed')
    }
  }

  async function handleDelete(addressId) {
    if (!user) return
    const ok = await deleteAddress(addressId)
    if (ok && mode === addressId) setMode('closed')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink">
            Saved addresses
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Used for delivery at checkout.
          </p>
        </div>
        {mode === 'closed' ? (
          <button
            type="button"
            onClick={() => setMode('add')}
            className="rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
          >
            Add address
          </button>
        ) : null}
      </div>

      {mode !== 'closed' ? (
        <AddressForm
          key={editing?.id ?? 'add'}
          initial={editing}
          onCancel={() => setMode('closed')}
          onSave={handleSave}
        />
      ) : null}

      {addresses.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setMode(address.id)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => {
                if (!user) return
                void setDefaultAddress(address.id)
              }}
            />
          ))}
        </div>
      ) : mode === 'closed' ? (
        <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <FiMapPin className="size-6" aria-hidden />
          </span>
          <p className="font-semibold text-ink">No addresses yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Add a home or work address for faster checkout.
          </p>
          <button
            type="button"
            onClick={() => setMode('add')}
            className="mt-4 rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
          >
            Add address
          </button>
        </div>
      ) : null}
    </div>
  )
}
