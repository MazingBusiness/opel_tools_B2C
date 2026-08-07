import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import ProductCard from '../../../shared/components/ProductCard'
import FeaturedSubCard from './FeaturedSubCard'

const BRAND_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#1a1a1a"><rect width="100%" height="100%"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ccb34d" font-family="sans-serif" font-size="18" font-weight="700">?</text></svg>',
  )

function CategorySectionHeader({ title, titleId, viewAllHref }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2
        id={titleId}
        className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
      >
        <span className="inline-block h-7 w-1 shrink-0 rounded-full bg-brand sm:h-8" aria-hidden />
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
  )
}

function BrandStrip({ brands }) {
  if (!brands?.length) return null

  return (
    <div className="rounded-lg bg-secondary p-4 text-ink-inverse">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-highlight">
        Shop by brand
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {brands.map((brand) => (
          <li key={brand.id}>
            <Link
              to={brand.href}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="flex size-14 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white/5 transition group-hover:border-highlight/60 group-hover:bg-white/10 sm:size-16">
                <img
                  src={brand.logoUrl}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = BRAND_PLACEHOLDER
                  }}
                />
              </span>
              <span className="text-xs font-medium text-white/90 group-hover:text-highlight">
                {brand.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeaturedSubGrid({ items }) {
  if (!items?.length) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {items.map((item) => (
        <FeaturedSubCard
          key={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          href={item.href}
        />
      ))}
    </div>
  )
}

function ProductCarousel({ products }) {
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
        <div className="flex gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_48%] sm:flex-[0_0_32%] md:flex-[0_0_24%] lg:flex-[0_0_19%]"
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
 * Reusable homepage category band.
 * @param {{
 *   title: string,
 *   viewAllHref: string,
 *   brands: Array<{ id: string, name: string, logoUrl: string, href: string }>,
 *   featuredSubCategories: Array<{ id: string, title: string, imageUrl: string, href: string }>,
 *   products: Array<object>,
 * }} props
 */
export default function CategorySection({
  id,
  title,
  viewAllHref,
  brands,
  featuredSubCategories,
  products,
}) {
  const titleId = `category-${id || title.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <section
      className="bg-surface-muted py-6 sm:py-8"
      aria-labelledby={titleId}
    >
      <div className="px-4">
        <CategorySectionHeader
          title={title}
          titleId={titleId}
          viewAllHref={viewAllHref}
        />

        <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-4">
          <BrandStrip brands={brands} />
          <FeaturedSubGrid items={featuredSubCategories} />
        </div>

        <ProductCarousel products={products} />
      </div>
    </section>
  )
}
