import Breadcrumb from '../../../shared/components/Breadcrumb'

/**
 * Shared chrome for footer / policy content pages.
 *
 * @param {{
 *   title: string,
 *   updated?: string,
 *   lead?: string,
 *   sections?: Array<{
 *     heading: string,
 *     paragraphs?: string[],
 *     bullets?: string[],
 *   }>,
 *   children?: import('react').ReactNode,
 * }} props
 */
export default function ContentPageLayout({
  title,
  updated,
  lead,
  sections,
  children,
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: title }]}
        className="px-0"
      />

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
      {updated ? (
        <p className="mt-1 text-xs text-ink-muted">Last updated {updated}</p>
      ) : null}
      {lead ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
          {lead}
        </p>
      ) : null}

      {sections?.length ? (
        <div className="mt-8 max-w-3xl space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-extrabold tracking-tight text-ink">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph, index) => (
                <p
                  key={`${section.heading}-p-${index}`}
                  className="mt-2 text-sm leading-relaxed text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-muted">
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.heading}-b-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  )
}
