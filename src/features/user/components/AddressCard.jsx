import { FiHome, FiBriefcase } from 'react-icons/fi'

/**
 * @param {{
 *   address: {
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
 *   },
 *   onEdit: () => void,
 *   onDelete: () => void,
 *   onSetDefault: () => void,
 * }} props
 */
export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const TypeIcon = address.type === 'work' ? FiBriefcase : FiHome

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand/5 px-2 py-0.5 text-xs font-semibold capitalize text-brand">
          <TypeIcon className="size-3.5" aria-hidden />
          {address.type}
        </span>
        {address.isDefault ? (
          <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
            Default
          </span>
        ) : null}
      </div>

      <h3 className="text-sm font-bold text-ink">{address.name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}
        <br />
        {address.city}, {address.state} {address.pincode}
      </p>
      <p className="mt-2 text-sm text-ink">{address.phone}</p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-red-400 hover:text-red-600"
        >
          Delete
        </button>
        {!address.isDefault ? (
          <button
            type="button"
            onClick={onSetDefault}
            className="rounded-md border-2 border-brand px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-ink-inverse"
          >
            Set default
          </button>
        ) : null}
      </div>
    </article>
  )
}
