import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiRefreshCw, FiShield, FiShoppingCart, FiTruck } from 'react-icons/fi'
import ProductPriceBlock from '../../../shared/components/ProductPriceBlock'
import QuantityStepper from '../../../shared/components/QuantityStepper'
import StarRating from '../../../shared/components/StarRating'
import { useCart } from '../../cart/hooks/useCart'
import { useWishlist } from '../../wishlist/hooks/useWishlist'

/**
 * @param {{ product: object }} props
 */
export default function ProductBuyBox({ product }) {
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    addToCart(product, quantity)
  }

  function handleBuyNow() {
    addToCart(product, quantity, { openDrawer: false })
    navigate('/cart')
  }

  function handleWishlist() {
    toggleWishlist(product)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 lg:sticky lg:top-[calc(var(--header-offset,120px)+1rem)]">
      <Link
        to={`/products?brand=${product.brandSlug}`}
        className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
      >
        {product.brandLabel}
      </Link>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {product.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
        <span className="text-xs text-ink-muted">SKU: {product.sku}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{product.description}</p>

      <div className="mt-5">
        <ProductPriceBlock
          currentPrice={product.currentPrice}
          originalPrice={product.originalPrice}
          discountPercentage={product.discountPercentage}
          size="lg"
        />
      </div>

      <p
        className={`mt-3 text-sm font-semibold ${product.inStock ? 'text-success' : 'text-ink-muted'}`}
      >
        {product.inStock ? 'In stock — ships in 2–4 business days' : 'Currently unavailable'}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-ink-muted">Qty</span>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-brand py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiShoppingCart className="size-4" />
          Add to cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex-1 rounded-md bg-highlight py-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy now
        </button>
      </div>

      <button
        type="button"
        onClick={handleWishlist}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold transition hover:border-brand hover:text-brand ${
          wishlisted ? 'border-brand bg-brand/5 text-brand' : 'text-ink-muted'
        }`}
        aria-pressed={wishlisted}
      >
        <FiHeart className={`size-4 ${wishlisted ? 'fill-current' : ''}`} aria-hidden />
        {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
      </button>

      <ul className="mt-6 space-y-3 border-t border-border pt-5">
        <li className="flex items-center gap-3 text-sm text-ink-muted">
          <FiTruck className="size-5 shrink-0 text-brand" aria-hidden />
          Free delivery on orders above ₹2,999
        </li>
        <li className="flex items-center gap-3 text-sm text-ink-muted">
          <FiShield className="size-5 shrink-0 text-brand" aria-hidden />
          12-month manufacturer warranty
        </li>
        <li className="flex items-center gap-3 text-sm text-ink-muted">
          <FiRefreshCw className="size-5 shrink-0 text-brand" aria-hidden />
          7-day easy returns on unused items
        </li>
      </ul>
    </div>
  )
}
