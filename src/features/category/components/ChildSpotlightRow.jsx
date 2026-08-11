import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCard from '../../../shared/components/ProductCard'

const BRAND_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">?</text></svg>',
  )

function SpotlightProductCarousel({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined

    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  if (!products?.length) return null

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-2.5 sm:gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_42%] sm:flex-[0_0_28%] md:flex-[0_0_20%] lg:flex-[0_0_15.5%]"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {canPrev ? (
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute -left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md transition hover:border-brand hover:bg-brand hover:text-ink-inverse sm:-left-3 sm:size-9"
          aria-label="Previous products"
        >
          <FiChevronLeft className="size-4" />
        </button>
      ) : null}

      {canNext ? (
        <button
          type="button"
          onClick={scrollNext}
          className="absolute -right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md transition hover:border-brand hover:bg-brand hover:text-ink-inverse sm:-right-3 sm:size-9"
          aria-label="Next products"
        >
          <FiChevronRight className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

/**
 * Spotlight row for a child category — brand chips + product carousel.
 * @param {{
 *   title: string,
 *   viewAllHref: string,
 *   brands?: Array<{ id: string, name: string, logoUrl: string, href: string }>,
 *   products?: Array<object>,
 *   muted?: boolean,
 * }} props
 */
export default function ChildSpotlightRow({
  title,
  viewAllHref,
  brands = [],
  products = [],
  muted = false,
}) {
  return (
    <section
      className={['px-4 py-6 sm:py-8', muted ? 'bg-surface-muted' : 'bg-surface'].join(' ')}
      aria-label={title}
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-ink sm:text-xl">
          <span
            className="inline-block h-6 w-1 shrink-0 rounded-full bg-brand sm:h-7"
            aria-hidden
          />
          {title}
        </h2>
        <Link
          to={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink transition hover:text-brand"
        >
          View all
          <FiArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      {brands.length > 0 ? (
        <ul className="mb-5 flex flex-wrap gap-2 sm:gap-3">
          {brands.map((item) => (
            <li key={item.id}>
              <Link
                to={item.href}
                className="group inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 transition hover:border-brand/40 hover:shadow-sm"
              >
                <span className="flex size-8 shrink-0 overflow-hidden rounded border border-border bg-surface-muted sm:size-9">
                  <img
                    src={item.logoUrl}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = BRAND_PLACEHOLDER
                    }}
                  />
                </span>
                <span className="text-xs font-medium text-ink group-hover:text-brand sm:text-sm">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <SpotlightProductCarousel products={products} />
    </section>
  )
}
