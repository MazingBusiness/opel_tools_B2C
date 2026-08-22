import { Link } from 'react-router-dom'

/**
 * Sticky actions panel for the wishlist page.
 * @param {{
 *   count: number,
 *   onAddAll: () => void,
 * }} props
 */
export default function WishlistActions({ count, onAddAll }) {
  const disabled = count === 0

  return (
    <aside className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-lg font-extrabold tracking-tight text-ink">Wishlist</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {count} {count === 1 ? 'saved item' : 'saved items'}
      </p>

      <p className="mt-4 text-sm text-ink-muted">
        Add items to your cart when you are ready to buy, or move them in one step.
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={onAddAll}
        className="mt-4 w-full rounded-md bg-highlight py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add all to cart
      </button>

      <Link
        to="/products"
        className="mt-3 block text-center text-sm font-semibold text-brand hover:underline"
      >
        Continue shopping
      </Link>
    </aside>
  )
}
