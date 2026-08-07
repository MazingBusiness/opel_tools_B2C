import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="#006f82"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14">Category</text></svg>',
  )

/**
 * Image-led featured subcategory tile.
 * @param {{ title: string, imageUrl: string, href: string }} props
 */
export default function FeaturedSubCard({ title, imageUrl, href }) {
  return (
    <Link
      to={href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-brand-dark sm:aspect-auto sm:min-h-[140px]"
    >
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = PLACEHOLDER
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-sm font-bold text-ink-inverse">{title}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-highlight transition group-hover:gap-1.5">
          Explore
          <FiArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
