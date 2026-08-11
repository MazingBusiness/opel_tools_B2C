import { Link } from 'react-router-dom'
import ProductCard from '../../../shared/components/ProductCard'

/**
 * Bottom product grid with Load more → products listing stub.
 * @param {{
 *   products: Array<object>,
 *   loadMoreHref: string,
 *   title?: string,
 * }} props
 */
export default function CategoryProductGrid({
  products,
  loadMoreHref,
  title = 'Popular products',
}) {
  if (!products?.length) return null

  return (
    <section className="border-t border-border px-4 py-8 sm:py-10" aria-label={title}>
      <h2 className="mb-5 flex items-center gap-3 text-lg font-extrabold tracking-tight text-ink sm:text-xl">
        <span
          className="inline-block h-6 w-1 shrink-0 rounded-full bg-brand sm:h-7"
          aria-hidden
        />
        {title}
      </h2>

      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((item) => (
          <li key={item.id}>
            <ProductCard {...item} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          to={loadMoreHref}
          className="inline-flex min-w-[10rem] items-center justify-center rounded-md border-2 border-brand bg-surface px-6 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-ink-inverse"
        >
          Load more
        </Link>
      </div>
    </section>
  )
}
