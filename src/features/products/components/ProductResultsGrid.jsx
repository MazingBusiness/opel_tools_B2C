import ProductCard from '../../../shared/components/ProductCard'
import { PRODUCT_GRID_CLASS } from '../utils/productGridLayout'

/**
 * @param {{ products: Array<object> }} props
 */
export default function ProductResultsGrid({ products }) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-12 text-center">
        <p className="text-base font-semibold text-ink">No products found</p>
        <p className="mt-1 text-sm text-ink-muted">
          Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <ul className={PRODUCT_GRID_CLASS}>
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard {...product} />
        </li>
      ))}
    </ul>
  )
}
