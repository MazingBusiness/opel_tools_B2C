import ProductCard from '../../../shared/components/ProductCard'

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
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard {...product} />
        </li>
      ))}
    </ul>
  )
}
