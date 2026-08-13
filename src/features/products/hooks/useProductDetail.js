import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById, getRelatedProducts } from '../data/productCatalog'
import { buildProductDetail } from '../data/productDetailEnrichment'
import { getAllBrandOptions, getCategoryLabel } from '../utils/categoryTaxonomy'

/**
 * @param {string | undefined} productId
 */
export function useProductDetail(productId) {
  return useMemo(() => {
    if (!productId) {
      return { product: null, related: [], breadcrumbs: [], notFound: true }
    }

    const base = getProductById(productId)
    if (!base) {
      return { product: null, related: [], breadcrumbs: [], notFound: true }
    }

    const product = buildProductDetail(base)
    const related = getRelatedProducts(base).map(buildProductDetail)
    const brandLabel =
      getAllBrandOptions().find((brand) => brand.slug === product.brandSlug)?.label ??
      product.brandSlug

    const breadcrumbs = [
      { label: 'Home', href: '/' },
      {
        label: getCategoryLabel(product.categorySlug),
        href: `/category/${product.categorySlug}`,
      },
      {
        label: getCategoryLabel(product.subCategorySlug),
        href: `/products?category=${product.categorySlug}&sub=${product.subCategorySlug}`,
      },
      { label: product.title },
    ]

    return {
      product: { ...product, brandLabel },
      related,
      breadcrumbs,
      notFound: false,
    }
  }, [productId])
}
