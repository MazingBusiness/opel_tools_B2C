import { useEffect, useId } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useUiStore } from '../../../app/store/useUiStore'
import { useWishlist } from '../hooks/useWishlist'
import WishlistItem from './WishlistItem'
import WishlistEmptyState from './WishlistEmptyState'

export default function WishlistDrawer() {
  const isOpen = useUiStore((s) => s.isWishlistOpen)
  const closeWishlist = useUiStore((s) => s.closeWishlist)
  const {
    items,
    count,
    removeFromWishlist,
    addToCartFromWishlist,
    moveToCart,
    addAllToCart,
  } = useWishlist()
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') closeWishlist()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeWishlist])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-secondary/50"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeWishlist()
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
            Wishlist
            {count > 0 ? (
              <span className="ml-2 text-sm font-semibold text-ink-muted">({count})</span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={closeWishlist}
            className="rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            aria-label="Close wishlist"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="py-8">
              <WishlistEmptyState onContinue={closeWishlist} />
            </div>
          ) : (
            items.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                compact
                onAddToCart={() => addToCartFromWishlist(item)}
                onMoveToCart={() => {
                  closeWishlist()
                  moveToCart(item)
                }}
                onRemove={() => {
                  removeFromWishlist(item.id)
                  toast.success('Removed from wishlist')
                }}
              />
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="shrink-0 border-t border-border p-4">
            <div className="flex flex-col gap-2">
              <Link
                to="/wishlist"
                onClick={closeWishlist}
                className="inline-flex items-center justify-center rounded-md border-2 border-brand py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
              >
                View wishlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeWishlist()
                  addAllToCart()
                }}
                className="rounded-md bg-highlight py-2.5 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
              >
                Add all to cart
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
