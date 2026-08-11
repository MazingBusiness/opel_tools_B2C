import { Link } from 'react-router-dom'

export default function CategoryMegaMenu({ category }) {
  if (!category) return null

  return (
    <div
      className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface shadow-lg"
      role="region"
      aria-label={`${category.label} subcategories`}
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {category.groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-bold text-ink">{group.title}</h3>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={
                      category.slug === 'power-tools' &&
                      link.slug === 'cordless-drills'
                        ? '/category/power-tools/cordless-drills'
                        : `/products?category=${encodeURIComponent(link.slug)}`
                    }
                    className="text-sm text-ink-muted transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
