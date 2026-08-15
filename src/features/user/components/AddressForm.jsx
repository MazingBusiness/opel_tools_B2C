import { useState } from 'react'
import { parseIdentifier } from '../../auth/utils/identifier'
import { EMPTY_ADDRESS, INPUT_CLASS, LABEL_CLASS } from '../utils/profileHelpers'

/**
 * @param {{
 *   initial?: Partial<typeof EMPTY_ADDRESS> & { id?: string },
 *   onCancel: () => void,
 *   onSave: (address: typeof EMPTY_ADDRESS) => void,
 * }} props
 */
export default function AddressForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial })
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Enter the recipient name.')
      return
    }
    const phone = parseIdentifier(form.phone)
    if (!phone.ok || phone.kind !== 'phone') {
      setError('Enter a valid 10–15 digit phone number.')
      return
    }
    if (!form.line1.trim()) {
      setError('Enter address line 1.')
      return
    }
    if (!form.city.trim() || !form.state.trim()) {
      setError('Enter city and state.')
      return
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Enter a 6-digit pincode.')
      return
    }

    onSave({
      ...form,
      name: form.name.trim(),
      phone: phone.identifier,
      line1: form.line1.trim(),
      line2: form.line2.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4 sm:p-5"
    >
      <h3 className="text-base font-extrabold tracking-tight text-ink">
        {initial?.id ? 'Edit address' : 'Add address'}
      </h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className={LABEL_CLASS}>Full name</span>
          <input
            className={INPUT_CLASS}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Phone</span>
          <input
            className={INPUT_CLASS}
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Address line 1</span>
          <input
            className={INPUT_CLASS}
            value={form.line1}
            onChange={(e) => setField('line1', e.target.value)}
            autoComplete="address-line1"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL_CLASS}>Address line 2 (optional)</span>
          <input
            className={INPUT_CLASS}
            value={form.line2}
            onChange={(e) => setField('line2', e.target.value)}
            autoComplete="address-line2"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>City</span>
          <input
            className={INPUT_CLASS}
            value={form.city}
            onChange={(e) => setField('city', e.target.value)}
            autoComplete="address-level2"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>State</span>
          <input
            className={INPUT_CLASS}
            value={form.state}
            onChange={(e) => setField('state', e.target.value)}
            autoComplete="address-level1"
          />
        </label>
        <label className="block">
          <span className={LABEL_CLASS}>Pincode</span>
          <input
            className={INPUT_CLASS}
            value={form.pincode}
            onChange={(e) => setField('pincode', e.target.value)}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
          />
        </label>
        <fieldset className="block">
          <legend className={LABEL_CLASS}>Type</legend>
          <div className="flex gap-4 pt-1">
            {['home', 'work'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm capitalize text-ink">
                <input
                  type="radio"
                  name="address-type"
                  value={type}
                  checked={form.type === type}
                  onChange={() => setField('type', type)}
                  className="accent-brand"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setField('isDefault', e.target.checked)}
            className="accent-brand"
          />
          <span className="text-sm text-ink">Set as default address</span>
        </label>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-highlight px-4 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
        >
          Save address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border-2 border-brand px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
