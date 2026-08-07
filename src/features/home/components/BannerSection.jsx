import BannerCard from './BannerCard'

/**
 * Static multi-banner row (not a carousel).
 * @param {{
 *   banners: Array<{
 *     id: string,
 *     eyebrow?: string,
 *     title: string,
 *     subtitle?: string,
 *     badge?: string,
 *     ctaLabel: string,
 *     href: string,
 *     imageUrl: string,
 *     tone?: string,
 *   }>,
 * }} props
 */
export default function BannerSection({ banners }) {
  if (!banners?.length) return null

  const count = banners.length
  const gridClass =
    count >= 4
      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
      : count === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : count === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1'

  return (
    <section className="bg-surface px-4 py-4 sm:py-5" aria-label="Promotions">
      <div className={['grid gap-3', gridClass].join(' ')}>
        {banners.map((banner) => (
          <BannerCard key={banner.id} {...banner} />
        ))}
      </div>
    </section>
  )
}
