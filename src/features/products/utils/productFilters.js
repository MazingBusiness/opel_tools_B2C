/**
 * URL ↔ filter state for the centralized products page.
 * Listing data comes from the Catalog API; this module only owns query-string shape.
 */

export const PAGE_SIZE = 24

export const SORT_OPTIONS = [
  { value: 'new_arrival', label: 'Newest' },
  { value: 'price_low_to_high', label: 'Price: Low to High' },
  { value: 'price_high_to_low', label: 'Price: High to Low' },
  { value: 'relevance', label: 'Relevance' },
]

/**
 * @typedef {Object} ProductFilterParams
 * @property {string[]} groups - category group slugs → API cat_groups
 * @property {string[]} categories - category slugs → API categories
 * @property {string[]} brands - brand slugs → API brands
 * @property {string | null} q
 * @property {number | null} min
 * @property {number | null} max
 * @property {boolean} inStock
 * @property {string} sort
 * @property {number} page
 * @property {number} perPage
 */

/** @param {string | null | undefined} value @returns {string[]} */
export function parseListParam(value) {
  if (!value?.trim()) return []
  return [...new Set(value.split(',').map((s) => s.trim()).filter(Boolean))]
}

/** @param {string[]} values */
export function serializeListParam(values) {
  return values.filter(Boolean).join(',')
}

/**
 * @param {string | null | undefined} raw
 * @returns {number | null}
 */
export function parseNonNegNumber(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

/**
 * Normalize min/max so we never send NaN or max < min to the API.
 * @param {number | null} min
 * @param {number | null} max
 * @returns {{ min: number | null, max: number | null }}
 */
export function normalizePriceRange(min, max) {
  let nextMin = min != null && Number.isFinite(min) && min >= 0 ? min : null
  let nextMax = max != null && Number.isFinite(max) && max >= 0 ? max : null
  if (nextMin != null && nextMax != null && nextMax < nextMin) {
    // Swap so the range stays usable instead of 422ing.
    const tmp = nextMin
    nextMin = nextMax
    nextMax = tmp
  }
  return { min: nextMin, max: nextMax }
}

/**
 * Categories available for the selected groups (or all if none selected).
 * @param {Array<{ slug: string, categories?: Array<{ slug: string, label: string, id?: number }> }>} groups
 * @param {string[]} groupSlugs
 * @param {Map<number, number> | null} [countById]
 */
export function categoriesForGroups(groups, groupSlugs, countById = null) {
  const selected = groupSlugs ?? []
  const source =
    selected.length === 0
      ? groups.flatMap((g) => g.categories ?? [])
      : groups
          .filter((g) => selected.includes(g.slug))
          .flatMap((g) => g.categories ?? [])

  const seen = new Set()
  const list = []
  for (const cat of source) {
    if (!cat?.slug || seen.has(cat.slug)) continue
    seen.add(cat.slug)
    list.push({
      slug: cat.slug,
      label: cat.label ?? cat.slug,
      id: cat.id,
      count:
        countById && cat.id != null ? (countById.get(Number(cat.id)) ?? null) : null,
    })
  }
  return list
}

const LEGACY_SORT = {
  price_asc: 'price_low_to_high',
  price_desc: 'price_high_to_low',
  rating: 'new_arrival',
  discount: 'new_arrival',
}

/**
 * @param {URLSearchParams} searchParams
 * @returns {ProductFilterParams}
 */
export function parseFilterParams(searchParams) {
  const minRaw = searchParams.get('min')
  const maxRaw = searchParams.get('max')
  const pageRaw = searchParams.get('page')
  const perPageRaw = searchParams.get('per_page')

  // Prefer new keys; fall back to legacy category/sub/brand URL shape.
  const groups = parseListParam(
    searchParams.get('group') || searchParams.get('cat_group'),
  )
  let categories = parseListParam(searchParams.get('category'))
  // Legacy: `sub` meant subcategory — map into categories when present.
  const legacySubs = parseListParam(searchParams.get('sub'))
  if (legacySubs.length && !searchParams.get('category')) {
    categories = legacySubs
  } else if (legacySubs.length) {
    categories = [...new Set([...categories, ...legacySubs])]
  }

  // If only legacy top-level `category` was used as a group-like slug and
  // `group` is empty, keep it as categories (API categories), which is closest.
  const brands = parseListParam(searchParams.get('brand'))

  let sort = searchParams.get('sort') || 'new_arrival'
  if (LEGACY_SORT[sort]) sort = LEGACY_SORT[sort]

  const perPage = perPageRaw
    ? Math.min(50, Math.max(1, Number(perPageRaw)))
    : PAGE_SIZE

  const { min, max } = normalizePriceRange(
    parseNonNegNumber(minRaw),
    parseNonNegNumber(maxRaw),
  )

  const pageNum = pageRaw ? Number(pageRaw) : 1

  return {
    groups,
    categories,
    brands,
    q: searchParams.get('q')?.trim() || null,
    min,
    max,
    inStock:
      searchParams.get('in_stock') === '1' ||
      searchParams.get('in_stock') === 'true',
    sort,
    page: Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : 1,
    perPage: Number.isFinite(perPage) ? perPage : PAGE_SIZE,
  }
}

/**
 * @param {Partial<ProductFilterParams>} filters
 */
export function buildFilterSearchParams(filters) {
  const params = new URLSearchParams()

  const groupStr = serializeListParam(filters.groups ?? [])
  const categoryStr = serializeListParam(filters.categories ?? [])
  const brandStr = serializeListParam(filters.brands ?? [])

  if (groupStr) params.set('group', groupStr)
  if (categoryStr) params.set('category', categoryStr)
  if (brandStr) params.set('brand', brandStr)
  if (filters.q) params.set('q', filters.q)
  const { min, max } = normalizePriceRange(
    filters.min ?? null,
    filters.max ?? null,
  )
  if (min != null && min > 0) params.set('min', String(min))
  if (max != null && max > 0) params.set('max', String(max))
  if (filters.inStock) params.set('in_stock', '1')
  if (filters.sort && filters.sort !== 'new_arrival') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (filters.perPage && filters.perPage !== PAGE_SIZE) {
    params.set('per_page', String(filters.perPage))
  }

  return params
}

/** @param {string[]} list @param {string} slug */
export function toggleListValue(list, slug) {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
}

/**
 * @param {ProductFilterParams} filters
 * @param {{
 *   groups?: Array<{ slug: string, label: string }>,
 *   categories?: Array<{ slug: string, label: string }>,
 *   brands?: Array<{ slug: string, label: string }>,
 * }} labels
 */
export function buildActiveFilters(filters, labels = {}) {
  /** @type {Array<{ key: string, label: string, value: string }>} */
  const active = []
  const groupLabel = Object.fromEntries((labels.groups ?? []).map((g) => [g.slug, g.label]))
  const categoryLabel = Object.fromEntries(
    (labels.categories ?? []).map((c) => [c.slug, c.label]),
  )
  const brandLabel = Object.fromEntries((labels.brands ?? []).map((b) => [b.slug, b.label]))

  for (const slug of filters.groups ?? []) {
    active.push({ key: 'groups', label: groupLabel[slug] ?? slug, value: slug })
  }
  for (const slug of filters.categories ?? []) {
    active.push({
      key: 'categories',
      label: categoryLabel[slug] ?? slug,
      value: slug,
    })
  }
  for (const slug of filters.brands ?? []) {
    active.push({ key: 'brands', label: brandLabel[slug] ?? slug, value: slug })
  }
  if (filters.q) {
    active.push({ key: 'q', label: `"${filters.q}"`, value: filters.q })
  }
  if (filters.min != null && filters.min > 0) {
    active.push({ key: 'min', label: `Min ₹${filters.min}`, value: String(filters.min) })
  }
  if (filters.max != null && filters.max > 0) {
    active.push({ key: 'max', label: `Max ₹${filters.max}`, value: String(filters.max) })
  }
  if (filters.inStock) {
    active.push({ key: 'inStock', label: 'In stock', value: '1' })
  }

  return active
}

/**
 * @param {ProductFilterParams} filters
 * @param {{
 *   groups?: Array<{ slug: string, label: string }>,
 *   categories?: Array<{ slug: string, label: string }>,
 *   brands?: Array<{ slug: string, label: string }>,
 * }} labels
 */
export function buildPageTitle(filters, labels = {}) {
  if (filters.q) return `Results for "${filters.q}"`
  const groupLabel = Object.fromEntries((labels.groups ?? []).map((g) => [g.slug, g.label]))
  const categoryLabel = Object.fromEntries(
    (labels.categories ?? []).map((c) => [c.slug, c.label]),
  )
  const brandLabel = Object.fromEntries((labels.brands ?? []).map((b) => [b.slug, b.label]))

  if ((filters.categories ?? []).length === 1) {
    return categoryLabel[filters.categories[0]] ?? 'Products'
  }
  if ((filters.groups ?? []).length === 1 && !(filters.categories ?? []).length) {
    return groupLabel[filters.groups[0]] ?? 'Products'
  }
  if ((filters.brands ?? []).length === 1) {
    return brandLabel[filters.brands[0]] ?? 'Products'
  }
  return 'All Products'
}

/**
 * @param {ProductFilterParams} filters
 * @param {{
 *   groups?: Array<{ slug: string, label: string }>,
 *   categories?: Array<{ slug: string, label: string }>,
 *   brands?: Array<{ slug: string, label: string }>,
 * }} labels
 */
export function buildBreadcrumbs(filters, labels = {}) {
  /** @type {Array<{ label: string, href?: string }>} */
  const items = [{ label: 'Home', href: '/' }]
  const groupLabel = Object.fromEntries((labels.groups ?? []).map((g) => [g.slug, g.label]))
  const categoryLabel = Object.fromEntries(
    (labels.categories ?? []).map((c) => [c.slug, c.label]),
  )
  const brandLabel = Object.fromEntries((labels.brands ?? []).map((b) => [b.slug, b.label]))

  const hasFilters =
    (filters.groups ?? []).length ||
    (filters.categories ?? []).length ||
    (filters.brands ?? []).length ||
    filters.q

  if (!hasFilters) {
    items.push({ label: 'Products' })
    return items
  }

  items.push({ label: 'Products', href: '/products' })

  if ((filters.groups ?? []).length === 1) {
    items.push({ label: groupLabel[filters.groups[0]] ?? filters.groups[0] })
  }
  if ((filters.categories ?? []).length === 1) {
    items.push({
      label: categoryLabel[filters.categories[0]] ?? filters.categories[0],
    })
  } else if ((filters.brands ?? []).length === 1 && !filters.q) {
    items.push({ label: brandLabel[filters.brands[0]] ?? filters.brands[0] })
  } else if (filters.q) {
    items.push({ label: `Search: ${filters.q}` })
  }

  return items
}

/**
 * Prune category slugs that no longer belong to selected groups.
 * @param {string[]} categorySlugs
 * @param {string[]} groupSlugs
 * @param {Array<{ slug: string, categories: Array<{ slug: string }> }>} groups
 */
export function pruneCategoriesForGroups(categorySlugs, groupSlugs, groups) {
  if (!groupSlugs.length) return categorySlugs
  const allowed = new Set()
  for (const group of groups) {
    if (!groupSlugs.includes(group.slug)) continue
    for (const cat of group.categories ?? []) allowed.add(cat.slug)
  }
  return categorySlugs.filter((slug) => allowed.has(slug))
}
