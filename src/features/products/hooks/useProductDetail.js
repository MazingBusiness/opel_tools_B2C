import { useMemo } from 'react'
import { useProductQuery, useRelatedProductsQuery } from '../api/hooks'

/**
 * Live PDP data from GET /api/v1/products/:id (or slug).
 * @param {string | undefined} productId
 */
export function useProductDetail(productId) {
  const detailQuery = useProductQuery(productId)
  const product = detailQuery.data ?? null

  const relatedQuery = useRelatedProductsQuery({
    categoryId: product?.categoryId ?? null,
    excludeId: product?.id ?? null,
    enabled: Boolean(product?.categoryId),
  })

  const breadcrumbs = useMemo(() => {
    if (!product) {
      return [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Product' },
      ]
    }

    /** @type {{ label: string, href?: string }[]} */
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
    ]

    if (product.groupSlug) {
      items.push({
        label: product.groupLabel || product.groupSlug,
        href: `/products?group=${encodeURIComponent(product.groupSlug)}`,
      })
    }

    if (product.categorySlug) {
      items.push({
        label: product.categoryLabel || product.categorySlug,
        href: `/products?category=${encodeURIComponent(product.categorySlug)}`,
      })
    }

    items.push({ label: product.title })
    return items
  }, [product])

  const status = detailQuery.error?.response?.status
  const notFound =
    Boolean(productId) &&
    !detailQuery.isLoading &&
    (status === 404 || (!detailQuery.isError && !product && detailQuery.isFetched))

  return {
    product,
    related: relatedQuery.data ?? [],
    breadcrumbs,
    notFound,
    isLoading: detailQuery.isLoading,
    isFetching: detailQuery.isFetching,
    isError: detailQuery.isError && status !== 404,
    error: detailQuery.error,
  }
}
