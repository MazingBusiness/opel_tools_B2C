import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

/**
 * @param {{ onContinue?: () => void }} props
 */
export default function CartEmptyState({ onContinue }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-16 text-center">
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <FiShoppingBag className="size-6" aria-hidden />
      </span>
      <h2 className="text-xl font-extrabold tracking-tight text-ink">Your cart is empty</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Add tools and accessories from the catalog to get started.
      </p>
      <Link
        to="/products"
        onClick={onContinue}
        className="mt-6 inline-flex rounded-md bg-highlight px-5 py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
      >
        Continue shopping
      </Link>
    </div>
  )
}
