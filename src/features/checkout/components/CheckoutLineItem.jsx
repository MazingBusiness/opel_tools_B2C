import { Link } from 'react-router-dom'
import { formatPrice } from '../../../shared/utils/formatPrice'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="12">Image</text></svg>',
  )

/**
 * @param {{
 *   item: {
 *     title: string,
 *     imageUrl: string,
 *     href: string,
 *     unitPrice: number,
 *     qty: number,
 *   },
 * }} props
 */
export default function CheckoutLineItem({ item }) {
  const lineTotal = item.unitPrice * item.qty

  return (
    <article className="flex gap-3 border-b border-border py-3 last:border-b-0">
      <Link
        to={item.href}
        className="size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted"
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
        <Link
          to={item.href}
          className="line-clamp-2 text-sm font-semibold text-ink transition hover:text-brand"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-ink-muted">
          Qty {item.qty} × {formatPrice(item.unitPrice)}
        </p>
      </div>
      <p className="shrink-0 text-sm font-extrabold text-ink">{formatPrice(lineTotal)}</p>
    </article>
  )
}
