import { Link } from 'react-router-dom'
import { formatPrice } from '../../../shared/utils/formatPrice'

const CONTENT_CLASS = [
  'max-w-3xl text-sm leading-relaxed text-ink-muted',
  '[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-ink',
  '[&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink',
  '[&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-ink',
  '[&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5',
  '[&_li]:mt-1 [&_a]:font-medium [&_a]:text-brand [&_a:hover]:text-brand-dark [&_a]:underline',
  '[&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3',
  '[&_strong]:text-ink [&_b]:text-ink [&_table]:mt-3 [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1',
  '[&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:text-ink',
  '[&>*:first-child]:mt-0',
].join(' ')

/**
 * Admin-authored SEO content, FAQ and related products for a page.
 * Renders nothing when the payload has none of them.
 *
 * `content` is sanitized by the BE on save AND on output (strict allowlist,
 * no attributes except vetted <a href>), so it is rendered as HTML here.
 *
 * @param {{ seo: import('../api/api').SeoPayload | null, className?: string }} props  (className replaces the default padding)
 */
export default function SeoPageExtras({ seo, className = '' }) {
  if (!seo || seo.status !== 200) return null

  const hasContent = Boolean(seo.content)
  const hasFaq = seo.faq?.length > 0
  const hasRelated = seo.related_products?.length > 0
  if (!hasContent && !hasFaq && !hasRelated) return null

  return (
    <div className={['space-y-8', className || 'px-4 py-8'].join(' ')}>
      {hasRelated ? (
        <section aria-labelledby="seo-related-heading">
          <h2 id="seo-related-heading" className="text-lg font-extrabold tracking-tight text-ink">
            You may also like
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {seo.related_products.map((p) => (
              <li key={p.id}>
                <Link
                  to={p.href}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-brand/40 hover:shadow-sm"
                >
                  <div className="aspect-square bg-surface-muted">
                    {p.thumbnail_img ? (
                      <img
                        src={p.thumbnail_img}
                        alt={p.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-2.5">
                    <p className="line-clamp-2 text-xs font-semibold text-ink sm:text-sm">{p.name}</p>
                    {p.unit_price ? (
                      <p className="mt-auto pt-1 text-sm font-bold text-ink">{formatPrice(p.unit_price)}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasContent ? (
        <section className={CONTENT_CLASS} dangerouslySetInnerHTML={{ __html: seo.content }} />
      ) : null}

      {hasFaq ? (
        <section aria-labelledby="seo-faq-heading" className="max-w-3xl">
          <h2 id="seo-faq-heading" className="text-lg font-extrabold tracking-tight text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
            {seo.faq.map((item, index) => (
              <details key={index} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
                  <span className="flex items-start justify-between gap-3">
                    {item.q}
                    <span aria-hidden className="text-ink-muted transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
