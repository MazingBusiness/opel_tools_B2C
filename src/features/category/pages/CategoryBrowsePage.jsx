import { Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import HeroCarousel from '../../../shared/components/HeroCarousel'
import { getCategoryNode } from '../data/categoryCatalog'
import SubcategoryStrip from '../components/SubcategoryStrip'
import ChildSpotlightRow from '../components/ChildSpotlightRow'
import CategoryProductGrid from '../components/CategoryProductGrid'

export default function CategoryBrowsePage() {
  const { categorySlug, subSlug } = useParams()
  const resolved = getCategoryNode(categorySlug, subSlug)

  if (!resolved) {
    const fallback = subSlug
      ? `/products?category=${encodeURIComponent(subSlug)}`
      : `/products?category=${encodeURIComponent(categorySlug ?? '')}`
    return <Navigate to={fallback} replace />
  }

  const { node, breadcrumbs } = resolved

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />

      <div className="px-4 pt-0 sm:pt-1.5">
        <HeroCarousel
          key={node.slug}
          slides={node.heroSlides}
          label={`${node.title} banners`}
        />
      </div>

      <header className="px-4 pt-6 sm:pt-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {node.title}
        </h1>
        {node.description ? (
          <p className="mt-1 w-full text-sm leading-relaxed text-ink-muted sm:text-base">
            {node.description}
          </p>
        ) : null}
      </header>

      <div className="mt-6 sm:mt-8">
        <SubcategoryStrip items={node.children} />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-3">
        {node.childSpotlights?.map((spotlight, index) => (
          <ChildSpotlightRow
            key={spotlight.childSlug}
            title={spotlight.title}
            viewAllHref={spotlight.viewAllHref}
            brands={spotlight.brands}
            products={spotlight.products}
            muted={index % 2 === 1}
          />
        ))}
      </div>

      <CategoryProductGrid
        products={node.products}
        loadMoreHref={node.productsHref}
        title={`Popular in ${node.title}`}
      />
    </div>
  )
}
