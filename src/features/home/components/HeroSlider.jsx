import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { heroSlides } from '../data/heroSlides'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="860" height="360" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="18">Banner unavailable</text></svg>',
  )

function HeroSlide({ slide }) {
  const image = (
    <img
      src={slide.imageUrl}
      alt=""
      className="h-full w-full object-cover"
      onError={(event) => {
        event.currentTarget.onerror = null
        event.currentTarget.src = PLACEHOLDER
      }}
    />
  )

  return (
    <div className="relative h-[180px] overflow-hidden rounded-md bg-surface-muted sm:h-[220px] md:h-[280px]">
      {slide.linkUrl ? (
        <Link to={slide.linkUrl} className="block h-full w-full">
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return undefined

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()

    return () => emblaApi.off('select', onSelect)
  }, [emblaApi])

  if (heroSlides.length === 0) return null

  const hasMultiple = heroSlides.length > 1

  return (
    <section
      className="relative w-full"
      aria-label="Promotional banners"
      aria-roledescription="carousel"
    >
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-md">
          <div className="flex">
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
              >
                <HeroSlide slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-1.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-ink shadow-md transition hover:bg-brand hover:text-ink-inverse sm:left-2 sm:size-8"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-1.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/95 text-ink shadow-md transition hover:bg-brand hover:text-ink-inverse sm:right-2 sm:size-8"
              aria-label="Next slide"
            >
              <FiChevronRight className="size-4" />
            </button>

            <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center gap-1.5">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={[
                    'size-2 rounded-full shadow-sm transition',
                    index === selectedIndex
                      ? 'bg-brand scale-110 ring-1 ring-white/80'
                      : 'bg-white/70 hover:bg-white',
                  ].join(' ')}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === selectedIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <p className="sr-only">
        Slide {selectedIndex + 1} of {heroSlides.length}
      </p>
    </section>
  )
}
