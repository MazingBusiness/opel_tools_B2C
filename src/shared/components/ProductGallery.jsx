import { useState } from 'react'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" fill="#f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Image unavailable</text></svg>',
  )

/**
 * @param {{
 *   images: string[],
 *   alt: string,
 *   className?: string,
 * }} props
 */
export default function ProductGallery({ images, alt, className = '' }) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER]
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = gallery[activeIndex] ?? gallery[0]

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-lg border border-border bg-surface-muted">
        <img
          src={activeImage}
          alt={alt}
          className="aspect-[4/5] w-full max-h-[420px] object-cover sm:aspect-square sm:max-h-[400px]"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = PLACEHOLDER
          }}
        />
      </div>

      {gallery.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((image, index) => (
            <li key={`${image}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`block size-14 overflow-hidden rounded-md border-2 transition sm:size-16 ${
                  index === activeIndex
                    ? 'border-brand ring-2 ring-brand/20'
                    : 'border-border hover:border-brand/40'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <img
                  src={image}
                  alt=""
                  className="size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = PLACEHOLDER
                  }}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
