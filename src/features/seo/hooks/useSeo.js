import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { fetchSeo } from '../api/api'

/**
 * SEO payload for the current route (path only; query strings are not SEO targets).
 * Keyed by pathname in the shared react-query cache, so SeoHead and page
 * components make a single request per path. Returns null while loading or on error.
 * @returns {import('../api/api').SeoPayload | null}
 */
export function useSeo() {
  const { pathname } = useLocation()
  const query = useQuery({
    queryKey: ['seo', pathname],
    queryFn: () => fetchSeo(pathname),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })

  return query.data ?? null
}

/**
 * H1 to render: admin override when set, otherwise the page's own heading.
 * @param {import('../api/api').SeoPayload | null} seo
 * @param {string} fallback
 */
export function seoHeading(seo, fallback) {
  return seo?.status === 200 && seo.h1_is_override && seo.h1 ? seo.h1 : fallback
}
