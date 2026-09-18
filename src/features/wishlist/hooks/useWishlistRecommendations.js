import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWishlistRecommendations } from '../api/api'

/**
 * @param {Array<{ productId: string, categoryId?: number | null, groupId?: number | null, categorySlug?: string }>} items
 */
export function useWishlistRecommendations(items) {
  const categoryIds = useMemo(
    () =>
      [
        ...new Set(
          (items ?? [])
            .map((item) => Number(item.categoryId))
            .filter((id) => Number.isFinite(id) && id > 0),
        ),
      ],
    [items],
  )

  const groupIds = useMemo(
    () =>
      [
        ...new Set(
          (items ?? [])
            .map((item) => Number(item.groupId))
            .filter((id) => Number.isFinite(id) && id > 0),
        ),
      ],
    [items],
  )

  const excludeIds = useMemo(
    () => (items ?? []).map((item) => item.productId),
    [items],
  )

  const viewAllHref = useMemo(() => {
    const first = (items ?? []).find((item) => item.categorySlug)
    if (first?.categorySlug) {
      return `/products?category=${encodeURIComponent(first.categorySlug)}`
    }
    const group = (items ?? []).find((item) => item.groupSlug)
    if (group?.groupSlug) {
      return `/products?group=${encodeURIComponent(group.groupSlug)}`
    }
    return '/products'
  }, [items])

  const enabled =
    (items?.length ?? 0) > 0 && (categoryIds.length > 0 || groupIds.length > 0)

  const query = useQuery({
    queryKey: ['wishlist', 'recommendations', categoryIds, groupIds, excludeIds],
    enabled,
    queryFn: () =>
      fetchWishlistRecommendations({
        categoryIds,
        groupIds,
        excludeIds,
        perPage: 12,
      }),
    staleTime: 60_000,
  })

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    viewAllHref,
  }
}
