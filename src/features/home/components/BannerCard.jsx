import { Link } from 'react-router-dom'

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" fill="#006f82"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14">Banner</text></svg>',
  )

const TONE_CLASS = {
  brand: 'bg-brand text-ink-inverse',
  brandDark: 'bg-brand-dark text-ink-inverse',
  ink: 'bg-secondary text-ink-inverse',
  muted: 'bg-[#e8f4f6] text-ink',
  sand: 'bg-[#f3efe4] text-ink',
  surface: 'bg-surface text-ink border border-border',
}

/**
 * Single promo / utility banner tile (static — not a carousel slide).
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subtitle?: string,
 *   badge?: string,
 *   ctaLabel: string,
 *   href: string,
 *   imageUrl: string,
 *   tone?: keyof typeof TONE_CLASS,
 * }} props
 */
export default function BannerCard({
  eyebrow,
  title,
  subtitle,
  badge,
  ctaLabel,
  href,
  imageUrl,
  tone = 'muted',
}) {
  const toneClass = TONE_CLASS[tone] ?? TONE_CLASS.muted
  const isDark = tone === 'brand' || tone === 'brandDark' || tone === 'ink'

  return (
    <Link
      to={href}
      className={[
        'group relative flex min-h-[140px] overflow-hidden rounded-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:min-h-[152px]',
        toneClass,
      ].join(' ')}
    >
      <div className="relative z-10 flex w-[55%] flex-col justify-center gap-1.5 p-3 sm:w-[52%] sm:p-4">
        {eyebrow ? (
          <span
            className={[
              'text-[10px] font-bold uppercase tracking-[0.12em]',
              isDark ? 'text-highlight' : 'text-brand',
            ].join(' ')}
          >
            {eyebrow}
          </span>
        ) : null}

        <h3 className="text-sm font-extrabold leading-snug sm:text-base">{title}</h3>

        {subtitle ? (
          <p
            className={[
              'line-clamp-2 text-[11px] leading-snug sm:text-xs',
              isDark ? 'text-white/75' : 'text-ink-muted',
            ].join(' ')}
          >
            {subtitle}
          </p>
        ) : null}

        {badge ? (
          <span
            className={[
              'mt-0.5 w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              isDark ? 'bg-highlight text-cta-foreground' : 'bg-brand text-ink-inverse',
            ].join(' ')}
          >
            {badge}
          </span>
        ) : null}

        <span
          className={[
            'mt-2 inline-flex w-fit items-center rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition',
            isDark
              ? 'bg-highlight text-cta-foreground group-hover:bg-highlight-dark'
              : 'bg-secondary text-ink-inverse group-hover:bg-brand',
          ].join(' ')}
        >
          {ctaLabel}
        </span>
      </div>

      <div className="absolute inset-y-0 right-0 w-[48%]">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = PLACEHOLDER
          }}
        />
        <div
          className={[
            'absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r to-transparent',
            tone === 'ink'
              ? 'from-secondary'
              : tone === 'brand' || tone === 'brandDark'
                ? 'from-brand-dark'
                : tone === 'sand'
                  ? 'from-[#f3efe4]'
                  : tone === 'surface'
                    ? 'from-surface'
                    : 'from-[#e8f4f6]',
          ].join(' ')}
        />
      </div>
    </Link>
  )
}
