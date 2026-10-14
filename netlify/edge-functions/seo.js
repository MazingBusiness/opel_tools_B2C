/**
 * OPEL SEO edge function: injects server-rendered <head> tags (title, meta,
 * canonical, OG/Twitter, JSON-LD) into the SPA's index.html so crawlers and
 * link unfurlers see per-route SEO without JS.
 *
 * Safety contract:
 *   - Never blocks the page: any error, non-JSON reply, or > ~1.5s BE latency
 *     returns the ORIGINAL response untouched (also `onError: 'bypass'`).
 *   - Only rewrites GET text/html responses (HEAD passes through untouched);
 *     assets/API/sitemap/robots are excluded.
 *   - BE 404 (unknown / unpublished target) → the HTML is served with HTTP 404.
 *   - head_html is produced by the BE from one escaped Blade template; it is
 *     inserted verbatim, never interpolated with request data here.
 *   - Successful rewrites are CDN-cached (cache: 'manual'): 200 → 300s, 404 → 60s.
 *   - Query strings are ignored for SEO: the BE is called with the pathname only,
 *     and the CDN cache key ignores the query (see CACHE_VARY below).
 *
 * Env (Netlify UI → Site configuration → Environment variables):
 *   SEO_API_BASE_URL  e.g. https://api.opeltools.com  (no trailing slash needed)
 *   SEO_EDGE_KEY      optional shared secret, same value as BE SEO_EDGE_KEY; sent as
 *                     X-Seo-Edge-Key so edge traffic gets the BE's higher shared rate limit.
 */

const TIMEOUT_MS = 1500
const CDN_CACHE_OK = 'public, s-maxage=300, stale-while-revalidate=60'
const CDN_CACHE_404 = 'public, s-maxage=60'

/*
 * Cache key ignores query strings. Requires `cache: 'manual'` (config below),
 * otherwise Netlify ignores Netlify-CDN-Cache-Control / Netlify-Vary for edge
 * function responses.
 *
 * Netlify-Vary query instruction (docs.netlify.com/platform/caching → "Vary by
 * query parameter"): `query=a|b` varies ONLY on the listed params and puts every
 * request that doesn't match them into ONE shared cache object. Netlify documents
 * `query` (vary on ALL params) and `query=a|b`; an empty `query=` list is not
 * documented, so we list one irrelevant param name the site never uses.
 * Result: /p, /p?utm=x, /p?q=1 all share one cache entry. No special-casing of
 * that param: it's cached like any other request.
 */
const CACHE_VARY = 'query=__opel_seo_unused'
const FILE_EXT = /\.[a-z0-9]{1,8}$/i

/**
 * @param {Request} request
 * @param {{ next: () => Promise<Response> }} context
 */
export default async function seo(request, context) {
  const original = await context.next()

  try {
    // HEAD (and anything non-GET) never gets a body rewrite.
    if (request.method !== 'GET') return original
    if (!original.ok) return original
    const type = original.headers.get('content-type') || ''
    if (!type.includes('text/html')) return original

    const url = new URL(request.url)
    const path = url.pathname // query/fragment never sent to the BE
    if (FILE_EXT.test(path) && !path.endsWith('.html')) return original

    const env = globalThis.Netlify?.env
    const base = (env?.get('SEO_API_BASE_URL') || '').replace(/\/+$/, '')
    if (!/^https?:\/\//i.test(base)) return original

    const result = await fetchSeo(
      `${base}/api/v1/seo?path=${encodeURIComponent(path)}`,
      env?.get('SEO_EDGE_KEY') || '',
    )
    const headHtml = result && typeof result.data.head_html === 'string' ? result.data.head_html.trim() : ''
    if (!headHtml) return original

    const html = await original.clone().text()
    // Drop the static <title>, then insert our block just before </head>
    // (after charset/viewport, so the charset meta stays first).
    const withoutTitle = html.replace(/<title[^>]*>[\s\S]*?<\/title>\s*/i, '')
    const headClose = withoutTitle.search(/<\/head>/i)
    if (headClose === -1) return original
    const out = `${withoutTitle.slice(0, headClose)}${headHtml}\n${withoutTitle.slice(headClose)}`

    const headers = new Headers(original.headers)
    headers.delete('content-length')
    headers.delete('etag')
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    const notFound = result.status === 404 || result.data.status === 404
    headers.set('netlify-vary', CACHE_VARY)
    headers.set('netlify-cdn-cache-control', notFound ? CDN_CACHE_404 : CDN_CACHE_OK)
    headers.set('x-opel-seo', notFound ? '404' : '200')

    return new Response(out, {
      status: notFound ? 404 : original.status,
      statusText: notFound ? 'Not Found' : original.statusText,
      headers,
    })
  } catch {
    return original
  }
}

/**
 * Fetch the SEO payload; the timeout covers headers AND body. 404 bodies are
 * valid (noindex payload for unknown/unpublished paths) and their HTTP status
 * is returned so the page can be served as a real 404.
 * @param {string} endpoint
 * @param {string} edgeKey
 * @returns {Promise<{ status: number, data: Record<string, any> } | null>}
 */
async function fetchSeo(endpoint, edgeKey) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const headers = { accept: 'application/json' }
    if (edgeKey) headers['x-seo-edge-key'] = edgeKey
    const res = await fetch(endpoint, { headers, signal: controller.signal })
    if (res.status !== 200 && res.status !== 404) return null
    if (!(res.headers.get('content-type') || '').includes('application/json')) return null
    const data = await res.json()
    return data && data.ok ? { status: res.status, data } : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export const config = {
  path: '/*',
  excludedPath: [
    '/assets/*',
    '/api/*',
    '/sitemap.xml',
    '/robots.txt',
    '/favicon*',
    '/*.js',
    '/*.css',
    '/*.map',
    '/*.json',
    '/*.webmanifest',
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.gif',
    '/*.svg',
    '/*.webp',
    '/*.avif',
    '/*.ico',
    '/*.woff',
    '/*.woff2',
    '/*.txt',
    '/*.xml',
  ],
  cache: 'manual',
  onError: 'bypass',
}
