import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import QuantityStepper from '../../../shared/components/QuantityStepper'
import { formatPrice } from '../../../shared/utils/formatPrice'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="12">Image</text></svg>',
  )

/**
 * @param {{
 *   item: {
 *     id: string,
 *     title: string,
 *     imageUrl: string,
 *     href: string,
 *     unitPrice: number,
 *     originalPrice: number,
 *     qty: number,
 *   },
 *   compact?: boolean,
 *   onQtyChange: (qty: number) => void,
 *   onRemove: () => void,
 * }} props
 */
export default function CartLineItem({ item, compact = false, onQtyChange, onRemove }) {
  const lineTotal = item.unitPrice * item.qty
  const imageClass = compact ? 'size-16' : 'size-20 sm:size-24'

  return (
    <article className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <Link
        to={item.href}
        className={`${imageClass} shrink-0 overflow-hidden rounded-md bg-surface-muted`}
      >
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = PLACEHOLDER
          }}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={item.href}
            className={`font-semibold text-ink transition hover:text-brand ${compact ? 'line-clamp-2 text-sm' : 'line-clamp-2 text-sm sm:text-base'}`}
          >
            {item.title}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-md p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            aria-label={`Remove ${item.title}`}
          >
            <FiTrash2 className="size-4" />
          </button>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-bold text-ink">{formatPrice(item.unitPrice)}</span>
          {item.originalPrice > item.unitPrice ? (
            <span className="text-xs text-ink-muted line-through">
              {formatPrice(item.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            value={item.qty}
            onChange={onQtyChange}
            className={compact ? 'scale-90 origin-left' : ''}
          />
          <p className="text-sm font-extrabold text-ink">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </article>
  )
}
