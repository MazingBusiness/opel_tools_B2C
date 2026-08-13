import { formatPrice } from '../utils/formatPrice'

/**
 * @param {{
 *   currentPrice: number,
 *   originalPrice: number,
 *   discountPercentage?: number,
 *   size?: 'sm' | 'lg',
 *   className?: string,
 * }} props
 */
export default function ProductPriceBlock({
  currentPrice,
  originalPrice,
  discountPercentage = 0,
  size = 'sm',
  className = '',
}) {
  const priceClass = size === 'lg' ? 'text-3xl font-extrabold' : 'text-base font-bold'
  const hasDiscount = originalPrice > currentPrice

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`${priceClass} text-ink`}>{formatPrice(currentPrice)}</span>
      {hasDiscount ? (
        <span className="text-sm text-ink-muted line-through">
          {formatPrice(originalPrice)}
        </span>
      ) : null}
      {discountPercentage > 0 ? (
        <span className="text-sm font-bold text-highlight-dark">{discountPercentage}% OFF</span>
      ) : null}
    </div>
  )
}
