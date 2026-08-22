import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import SectionHeading from '../../../shared/components/SectionHeading'
import ProductCard from '../../../shared/components/ProductCard'
import { getProductById } from '../../products/data/productCatalog'
import { WISHLIST_REC_IDS } from '../data/mockWishlist'
import { useWishlist } from '../hooks/useWishlist'
import WishlistEmptyState from '../components/WishlistEmptyState'
import WishlistItem from '../components/WishlistItem'
import WishlistActions from '../components/WishlistActions'

export default function WishlistPage() {
  const {
    items,
    count,
    removeFromWishlist,
    addToCartFromWishlist,
    moveToCart,
    addAllToCart,
  } = useWishlist()
  const wishIds = new Set(items.map((item) => item.productId))
  const recs = WISHLIST_REC_IDS.map((id) => getProductById(id)).filter(
    (product) => product && !wishIds.has(product.id),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        className="px-0"
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Wishlist</h1>
        {count > 0 ? (
          <p className="text-sm text-ink-muted">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <WishlistEmptyState />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="rounded-lg border border-border bg-surface px-4">
            {items.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                onAddToCart={() => addToCartFromWishlist(item)}
                onMoveToCart={() => moveToCart(item)}
                onRemove={() => {
                  removeFromWishlist(item.id)
                  toast.success('Removed from wishlist')
                }}
              />
            ))}
          </div>
          <div className="lg:sticky lg:top-[calc(var(--header-offset,120px)+1rem)]">
            <WishlistActions count={count} onAddAll={addAllToCart} />
          </div>
        </div>
      )}

      {recs.length > 0 ? (
        <section className="mt-12" aria-labelledby="wishlist-recs-heading">
          <SectionHeading
            title="You may also like"
            titleId="wishlist-recs-heading"
            viewAllHref="/products"
            viewAllLabel="View all"
          />
          <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
            {recs.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_48%] sm:flex-[0_0_32%] md:flex-[0_0_24%] lg:flex-[0_0_19%]"
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {items.length > 0 ? (
        <p className="mt-8 text-center text-sm text-ink-muted">
          Need help?{' '}
          <Link to="/products" className="font-semibold text-brand hover:underline">
            Browse products
          </Link>
        </p>
      ) : null}
    </div>
  )
}
