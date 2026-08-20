import { useEffect, useId } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../../../app/store/useUiStore'
import { useCart } from '../hooks/useCart'
import CartLineItem from './CartLineItem'
import CartEmptyState from './CartEmptyState'
import { formatPrice } from '../../../shared/utils/formatPrice'

export default function CartDrawer() {
  const isOpen = useUiStore((s) => s.isCartOpen)
  const closeCart = useUiStore((s) => s.closeCart)
  const { items, totals, setQty, removeItem } = useCart()
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') closeCart()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-secondary/50"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCart()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-xl bg-surface shadow-xl"
      >
        <div className="h-1.5 w-full shrink-0 bg-brand" aria-hidden />

        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-lg font-extrabold tracking-tight text-ink">
            Cart
            {totals.itemCount > 0 ? (
              <span className="ml-2 text-sm font-semibold text-ink-muted">
                ({totals.itemCount})
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            aria-label="Close cart"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-8">
              <CartEmptyState onContinue={closeCart} />
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                compact
                onQtyChange={(qty) => setQty(item.id, qty)}
                onRemove={() => {
                  removeItem(item.id)
                  toast.success('Removed from cart')
                }}
              />
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="shrink-0 border-t border-border p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">Subtotal</span>
              <span className="font-extrabold text-ink">{formatPrice(totals.subtotal)}</span>
            </div>
            <p className="mb-3 text-[11px] text-ink-muted">
              Shipping and GST details are shown on the cart page.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="inline-flex items-center justify-center rounded-md border-2 border-brand py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
              >
                View cart
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  toast.success('Checkout coming soon')
                }}
                className="rounded-md bg-highlight py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
