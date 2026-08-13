import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCard from '../../../shared/components/ProductCard'
import SectionHeading from '../../../shared/components/SectionHeading'

/**
 * @param {{ products: Array<object>, categorySlug: string }} props
 */
export default function RelatedProductsRow({ products, categorySlug }) {
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

  if (!products.length) return null

  return (
    <section className="mt-8 sm:mt-10" aria-label="Related products">
      <SectionHeading
        title="Related products"
        viewAllHref={`/products?category=${categorySlug}`}
      />

      <div className="relative mt-4">
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
    </section>
  )
}
