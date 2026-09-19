import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import SectionHeading from '../../../shared/components/SectionHeading'
import ProductCard from '../../../shared/components/ProductCard'
import { getProductById } from '../../products/data/productCatalog'
import { CART_REC_IDS } from '../data/mockCart'
import { useAuthStore } from '../../../app/store/useAuthStore'
import { useCartStore } from '../../../app/store/useCartStore'
import { useCart } from '../hooks/useCart'
import { hydrateCartFromServer } from '../api/hydrate'
import CartEmptyState from '../components/CartEmptyState'
import CartLineItem from '../components/CartLineItem'
import CartSummary from '../components/CartSummary'

export default function CartPage() {
  const { items, totals, setQty, removeItem } = useCart()
  const token = useAuthStore((s) => s.token)
  const serverHydrated = useCartStore((s) => s.serverHydrated)

  useEffect(() => {
    if (!token || serverHydrated) return
    void hydrateCartFromServer()
  }, [token, serverHydrated])

  const cartIds = new Set(items.map((item) => item.productId))
  const recs = CART_REC_IDS.map((id) => getProductById(id)).filter(
    (product) => product && !cartIds.has(product.id),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="px-0" />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Shopping cart</h1>
        {totals.itemCount > 0 ? (
          <p className="text-sm text-ink-muted">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
          </p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <CartEmptyState />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="rounded-lg border border-border bg-surface px-4">
            {items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                onQtyChange={(qty) => setQty(item.id, qty)}
                onRemove={() => {
                  removeItem(item.id)
                  toast.success('Removed from cart')
                }}
              />
            ))}
          </div>
          <div className="lg:sticky lg:top-[calc(var(--header-offset,120px)+1rem)]">
            <CartSummary totals={totals} />
          </div>
        </div>
      )}

      {recs.length > 0 ? (
        <section className="mt-12" aria-labelledby="cart-recs-heading">
          <SectionHeading
            title="You may also like"
            titleId="cart-recs-heading"
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
