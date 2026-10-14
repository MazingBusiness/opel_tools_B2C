import { apiClient } from '../../../shared/api/client'

export const SEO_ENDPOINT = '/api/v1/seo'

/**
 * @typedef {{
 *   ok: boolean,
 *   path: string | null,
 *   status: number,
 *   type: string,
 *   title: string,
 *   description: string,
 *   robots: string,
 *   canonical_url: string | null,
 *   h1: string | null,
 *   h1_is_override: boolean,
 *   content: string | null,
 *   og: { title: string, description: string, image: string | null, url: string | null, type: string, site_name: string },
 *   breadcrumbs: Array<{ label: string, href: string }>,
 *   faq: Array<{ q: string, a: string }>,
 *   related_products: Array<{ id: number, name: string, href: string, thumbnail_img: string | null, unit_price: number | null, mrp: number | null }>,
 *   image_alts: Record<string, string>,
 *   head_html: string,
 * }} SeoPayload
 */

/**
 * GET /api/v1/seo?path=… — 404s still carry a (noindex) payload, so return it.
 * @param {string} path
 * @returns {Promise<SeoPayload | null>}
 */
export async function fetchSeo(path) {
  try {
    const { data } = await apiClient.get(SEO_ENDPOINT, { params: { path } })
    return data
  } catch (error) {
    const data = /** @type {{ response?: { status?: number, data?: SeoPayload } }} */ (error).response
    if (data?.status === 404 && data.data?.ok) return data.data
    throw error
  }
}
