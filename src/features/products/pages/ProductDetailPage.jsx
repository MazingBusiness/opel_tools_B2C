import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../../../shared/components/Breadcrumb'
import ProductGallery from '../../../shared/components/ProductGallery'
import { useProductDetail } from '../hooks/useProductDetail'
import ProductBuyBox from '../components/ProductBuyBox'
import ProductDetailTabs from '../components/ProductDetailTabs'
import RelatedProductsRow from '../components/RelatedProductsRow'

function ProductNotFound() {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold text-ink">Product not found</h1>
      <p className="mt-2 max-w-md text-sm text-ink-muted">
        The product you are looking for may have been removed or the link is incorrect.
      </p>
      <Link
        to="/products"
        className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-bold text-ink-inverse transition hover:bg-brand-dark"
      >
        Browse all products
      </Link>
    </div>
  )
}

export default function ProductDetailPage() {
  const { productId } = useParams()
  const { product, related, breadcrumbs, notFound } = useProductDetail(productId)

  if (notFound || !product) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Product not found' }]} />
        <ProductNotFound />
      </div>
    )
  }

  return (
    <div className="pb-10">
      <Breadcrumb items={breadcrumbs} />

      <div className="mx-auto mt-4 grid max-w-7xl gap-6 px-4 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <ProductGallery
          images={product.images}
          alt={product.title}
          className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-[400px]"
        />
        <ProductBuyBox product={product} />
      </div>

      <div className="mt-8 px-4 sm:mt-10">
        <ProductDetailTabs product={product} />
      </div>

      <div className="px-4">
        <RelatedProductsRow products={related} categorySlug={product.categorySlug} />
      </div>
    </div>
  )
}
