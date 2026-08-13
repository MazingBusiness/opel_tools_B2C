import StarRating from '../../../shared/components/StarRating'

/**
 * @param {{ product: object }} props
 */
export default function ProductReviewsSection({ product }) {
  const reviews = product.reviews ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface-muted/50 p-4">
        <div>
          <p className="text-3xl font-extrabold text-ink">{product.rating.toFixed(1)}</p>
          <StarRating rating={product.rating} showCount={false} size="md" />
        </div>
        <p className="text-sm text-ink-muted">
          Based on {product.reviewCount.toLocaleString('en-IN')} ratings
        </p>
      </div>

      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">{review.author}</p>
              <time className="text-xs text-ink-muted">{review.date}</time>
            </div>
            <div className="mt-1">
              <StarRating rating={review.rating} showCount={false} size="sm" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
