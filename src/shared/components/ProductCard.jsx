import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { getProductDetailHref } from '../../features/products/data/productCatalog'
import { useCart } from '../../features/cart/hooks/useCart'
import ProductPriceBlock from './ProductPriceBlock'
import StarRating from './StarRating'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Image unavailable</text></svg>',
  )

/**
 * Shared marketplace product card — fixed height via flex + line-clamp.
 * @param {{
 *   id: string,
 *   title: string,
 *   imageUrl: string,
 *   rating: number,
 *   reviewCount: number,
 *   currentPrice: number,
 *   originalPrice: number,
 *   discountPercentage: number,
 * }} props
 */
export default function ProductCard({
  id,
  title,
  imageUrl,
  rating,
  reviewCount,
  currentPrice,
  originalPrice,
  discountPercentage,
}) {
  const productHref = getProductDetailHref(id)
  const { addToCart } = useCart()

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
      <Link to={productHref} className="relative block aspect-square overflow-hidden bg-surface-muted">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = PLACEHOLDER
          }}
        />
        <span className="absolute left-2 top-2 rounded-md bg-surface/95 px-1.5 py-0.5 shadow-sm ring-1 ring-black/5">
          <StarRating rating={rating} reviewCount={reviewCount} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={productHref} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-ink transition group-hover:text-brand">
            {title}
          </h3>
        </Link>

        <div className="mt-auto">
          <ProductPriceBlock
            currentPrice={currentPrice}
            originalPrice={originalPrice}
            discountPercentage={discountPercentage}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              addToCart(
                {
                  id,
                  title,
                  imageUrl,
                  href: productHref,
                  currentPrice,
                  originalPrice,
                  discountPercentage,
                },
                1,
              )
            }}
            className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-brand text-brand transition hover:bg-brand hover:text-ink-inverse"
            aria-label="Add to cart"
          >
            <FiShoppingCart className="size-4" />
          </button>
          <Link
            to={productHref}
            className="flex flex-1 items-center justify-center rounded-md bg-highlight px-3 text-sm font-bold text-cta-foreground transition hover:bg-highlight-dark"
          >
            Buy now
          </Link>
        </div>
      </div>
    </article>
  )
}
