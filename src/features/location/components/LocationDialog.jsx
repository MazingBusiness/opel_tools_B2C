import { useEffect, useId, useState } from 'react'
import { FiCheck, FiMapPin, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../../../app/store/useUiStore'
import { useLocationStore } from '../../../app/store/useLocationStore'
import { useCurrentProfile } from '../../user/hooks/useCurrentProfile'
import { INPUT_CLASS, LABEL_CLASS } from '../../user/utils/profileHelpers'
import { lookupPincode } from '../data/serviceablePincodes'

export default function LocationDialog() {
  const isOpen = useUiStore((s) => s.isLocationDialogOpen)
  const closeLocationDialog = useUiStore((s) => s.closeLocationDialog)
  const location = useLocationStore((s) => s.location)
  const setLocation = useLocationStore((s) => s.setLocation)
  const { user, profile } = useCurrentProfile()
  const titleId = useId()

  const [pincode, setPincode] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') closeLocationDialog()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeLocationDialog])

  useEffect(() => {
    if (!isOpen) {
      setPincode('')
      setError('')
      setPreview(null)
      return
    }
    if (location?.pincode) {
      setPincode(location.pincode)
      setPreview({
        pincode: location.pincode,
        city: location.city,
        state: location.state,
        serviceable: true,
      })
    }
  }, [isOpen, location])

  if (!isOpen) return null

  const savedAddresses = profile?.addresses ?? []

  function handleCheck(event) {
    event.preventDefault()
    const result = lookupPincode(pincode)
    if (!result.ok) {
      setError(result.error ?? 'Unable to check this pincode.')
      setPreview(null)
      return
    }
    setError('')
    setPreview({
      pincode: result.pincode,
      city: result.city,
      state: result.state,
      serviceable: true,
    })
  }

  function applyLocation(next) {
    setLocation(next)
    toast.success(`Delivering to ${next.city} ${next.pincode}`)
    closeLocationDialog()
  }

  function handleApplyPincode() {
    if (!preview) {
      const result = lookupPincode(pincode)
      if (!result.ok) {
        setError(result.error ?? 'Enter a valid pincode.')
        return
      }
      applyLocation({
        pincode: result.pincode,
        city: result.city,
        state: result.state,
      })
      return
    }
    applyLocation({
      pincode: preview.pincode,
      city: preview.city,
      state: preview.state,
    })
  }

  function handleSelectAddress(address) {
    applyLocation({
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      label: address.type === 'work' ? 'Work' : 'Home',
      addressId: address.id,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-secondary/50 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLocationDialog()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-surface shadow-xl sm:rounded-xl"
      >
        <div className="h-1.5 w-full bg-brand" aria-hidden />

        <button
          type="button"
          onClick={closeLocationDialog}
          className="absolute right-3 top-4 rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
          aria-label="Close"
        >
          <FiX className="size-5" />
        </button>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          <div className="flex items-start gap-3 pr-8">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <FiMapPin className="size-4" />
            </span>
            <div>
              <h2 id={titleId} className="text-lg font-extrabold text-ink">
                Select delivery location
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Enter your pincode to see delivery options in your area.
              </p>
            </div>
          </div>

          <form onSubmit={handleCheck} className="mt-5">
            <label>
              <span className={LABEL_CLASS}>Pincode</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                    setPreview(null)
                  }}
                  placeholder="e.g. 560001"
                  className={INPUT_CLASS}
                  autoComplete="postal-code"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md border-2 border-brand px-4 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
                >
                  Check
                </button>
              </div>
            </label>
            {error ? (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </form>

          {preview ? (
            <div className="mt-4 rounded-lg border border-border bg-surface-muted px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FiCheck className="size-4 shrink-0 text-success" />
                {preview.city}, {preview.state}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Pincode {preview.pincode} — we deliver here
              </p>
              <button
                type="button"
                onClick={handleApplyPincode}
                className="mt-3 w-full rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
              >
                Deliver here
              </button>
            </div>
          ) : null}

          {user && savedAddresses.length > 0 ? (
            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Saved addresses
              </h3>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {savedAddresses.map((address) => {
                  const selected =
                    location?.addressId === address.id ||
                    (location?.pincode === address.pincode &&
                      !location?.addressId)
                  return (
                    <li key={address.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectAddress(address)}
                        className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition hover:bg-surface-muted ${
                          selected ? 'bg-brand/5' : ''
                        }`}
                      >
                        <span className="text-sm font-semibold text-ink">
                          {address.type === 'work' ? 'Work' : 'Home'}
                          {address.isDefault ? (
                            <span className="ml-2 text-xs font-medium text-brand">
                              Default
                            </span>
                          ) : null}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {address.city}, {address.state} {address.pincode}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          {!user ? (
            <p className="mt-5 text-xs text-ink-muted">
              Sign in to pick from your saved addresses.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
