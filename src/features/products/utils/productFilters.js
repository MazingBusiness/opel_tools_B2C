import {
  normalizeFilterParams,
  getCategoryLabel,
  getAllBrandOptions,
  resolveSlug,
  topLevelSlugs,
} from './categoryTaxonomy'

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Discount %' },
]

const PAGE_SIZE = 24

/**
 * @typedef {Object} ProductFilterParams
 * @property {string[]} categories
 * @property {string[]} subs
 * @property {string[]} brands
 * @property {string | null} q
 * @property {number | null} min
 * @property {number | null} max
 * @property {number | null} ratingMin
 * @property {string} sort
 * @property {number} page
 */

/**
 * @param {string | null | undefined} value
 * @returns {string[]}
 */
export function parseListParam(value) {
  if (!value?.trim()) return []
  return [...new Set(value.split(',').map((s) => s.trim()).filter(Boolean))]
}

/**
 * @param {string[]} values
 * @returns {string | null}
 */
export function serializeListParam(values) {
  if (!values?.length) return null
  return [...new Set(values)].join(',')
}

/**
 * Parse legacy single or multi category/sub params into arrays.
 * @param {string | null} rawCategory
 * @param {string | null} rawSub
 */
function parseCategorySubParams(rawCategory, rawSub) {
  /** @type {string[]} */
  let categories = []
  let subs = parseListParam(rawSub)

  for (const slug of parseListParam(rawCategory)) {
    if (topLevelSlugs.has(slug)) {
      if (!categories.includes(slug)) categories.push(slug)
    } else {
      const normalized = normalizeFilterParams({ category: slug, sub: null })
      if (normalized.category && !categories.includes(normalized.category)) {
        categories.push(normalized.category)
      }
      if (normalized.sub && !subs.includes(normalized.sub)) {
        subs.push(normalized.sub)
      }
    }
  }

  if (subs.length && categories.length === 0) {
    for (const sub of subs) {
      const normalized = normalizeFilterParams({ category: null, sub })
      if (normalized.category && !categories.includes(normalized.category)) {
        categories.push(normalized.category)
      }
    }
  }

  return { categories, subs }
}

/**
 * Parse URLSearchParams into normalized filter state.
 * @param {URLSearchParams} searchParams
 * @returns {ProductFilterParams}
 */
export function parseFilterParams(searchParams) {
  const rawCategory = searchParams.get('category')
  const rawSub = searchParams.get('sub')
  const { categories, subs } = parseCategorySubParams(rawCategory, rawSub)

  const minRaw = searchParams.get('min')
  const maxRaw = searchParams.get('max')
  const ratingRaw = searchParams.get('ratingMin')
  const pageRaw = searchParams.get('page')

  return {
    categories,
    subs,
    brands: parseListParam(searchParams.get('brand')),
    q: searchParams.get('q')?.trim() || null,
    min: minRaw ? Number(minRaw) : null,
    max: maxRaw ? Number(maxRaw) : null,
    ratingMin: ratingRaw ? Number(ratingRaw) : null,
    sort: searchParams.get('sort') || 'relevance',
    page: pageRaw ? Math.max(1, Number(pageRaw)) : 1,
  }
}

/**
 * Build URLSearchParams from filter state (omit defaults).
 * @param {Partial<ProductFilterParams>} filters
 */
export function buildFilterSearchParams(filters) {
  const params = new URLSearchParams()

  const categoryStr = serializeListParam(filters.categories ?? [])
  const subStr = serializeListParam(filters.subs ?? [])
  const brandStr = serializeListParam(filters.brands ?? [])

  if (categoryStr) params.set('category', categoryStr)
  if (subStr) params.set('sub', subStr)
  if (brandStr) params.set('brand', brandStr)
  if (filters.q) params.set('q', filters.q)
  if (filters.min != null && filters.min > 0) params.set('min', String(filters.min))
  if (filters.max != null && filters.max > 0) params.set('max', String(filters.max))
  if (filters.ratingMin != null && filters.ratingMin > 0) {
    params.set('ratingMin', String(filters.ratingMin))
  }
  if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  return params
}

function relevanceScore(product, filters) {
  let score = 0
  if (filters.q) {
    const q = filters.q.toLowerCase()
    if (product.title.toLowerCase().includes(q)) score += 10
    if (product.brandSlug?.includes(q)) score += 5
  }
  if (filters.subs.length && filters.subs.includes(product.subCategorySlug)) score += 8
  if (filters.categories.length && filters.categories.includes(product.categorySlug)) score += 4
  if (filters.brands.length && filters.brands.includes(product.brandSlug)) score += 6
  return score
}

/**
 * @param {Array} products
 * @param {ProductFilterParams} filters
 */
export function filterAndSortProducts(products, filters) {
  let result = [...products]

  if (filters.categories.length) {
    result = result.filter((p) => filters.categories.includes(p.categorySlug))
  }
  if (filters.subs.length) {
    result = result.filter((p) => filters.subs.includes(p.subCategorySlug))
  }
  if (filters.brands.length) {
    result = result.filter((p) => filters.brands.includes(p.brandSlug))
  }
  if (filters.q) {
    const q = filters.q.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brandSlug?.includes(q) ||
        p.subCategorySlug?.includes(q),
    )
  }
  if (filters.min != null && filters.min > 0) {
    result = result.filter((p) => p.currentPrice >= filters.min)
  }
  if (filters.max != null && filters.max > 0) {
    result = result.filter((p) => p.currentPrice <= filters.max)
  }
  if (filters.ratingMin != null && filters.ratingMin > 0) {
    result = result.filter((p) => p.rating >= filters.ratingMin)
  }

  switch (filters.sort) {
    case 'price_asc':
      result.sort((a, b) => a.currentPrice - b.currentPrice)
      break
    case 'price_desc':
      result.sort((a, b) => b.currentPrice - a.currentPrice)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      break
    case 'discount':
      result.sort((a, b) => b.discountPercentage - a.discountPercentage)
      break
    default:
      result.sort((a, b) => relevanceScore(b, filters) - relevanceScore(a, filters))
  }

  return result
}

/**
 * @param {Array} products
 * @param {ProductFilterParams} filters
 */
export function paginateProducts(products, filters) {
  const page = filters.page || 1
  const total = products.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE

  return {
    items: products.slice(start, start + PAGE_SIZE),
    total,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages,
    startIndex: total === 0 ? 0 : start + 1,
    endIndex: Math.min(start + PAGE_SIZE, total),
  }
}

/**
 * @param {Array} allProducts
 * @param {ProductFilterParams} filters
 */
export function getFilterFacets(allProducts, filters) {
  void filters
  return {
    priceMin: Math.min(...allProducts.map((p) => p.currentPrice)),
    priceMax: Math.max(...allProducts.map((p) => p.currentPrice)),
  }
}

/**
 * Count products matching a single facet value given other active filters.
 * @param {Array} allProducts
 * @param {ProductFilterParams} filters
 * @param {'categories' | 'subs' | 'brands'} groupKey
 * @param {string} slug
 */
export function countProductsForFacet(allProducts, filters, groupKey, slug) {
  const trial = { ...filters }
  if (groupKey === 'categories') {
    trial.categories = [slug]
    trial.subs = []
  } else if (groupKey === 'subs') {
    trial.subs = [slug]
  } else {
    trial.brands = [slug]
  }
  return filterAndSortProducts(allProducts, trial).length
}

/**
 * @param {ProductFilterParams} filters
 */
export function buildActiveFilters(filters) {
  /** @type {Array<{ key: string, label: string, value: string }>} */
  const active = []

  for (const slug of filters.categories) {
    active.push({
      key: 'categories',
      label: getCategoryLabel(slug),
      value: slug,
    })
  }
  for (const slug of filters.subs) {
    active.push({
      key: 'subs',
      label: getCategoryLabel(slug),
      value: slug,
    })
  }
  for (const slug of filters.brands) {
    const brand = getAllBrandOptions().find((b) => b.slug === slug)
    active.push({
      key: 'brands',
      label: brand?.label ?? slug,
      value: slug,
    })
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
  if (filters.ratingMin != null && filters.ratingMin > 0) {
    active.push({
      key: 'ratingMin',
      label: `${filters.ratingMin}+ stars`,
      value: String(filters.ratingMin),
    })
  }

  return active
}

/**
 * @param {ProductFilterParams} filters
 */
export function buildPageTitle(filters) {
  if (filters.q) return `Results for "${filters.q}"`
  if (filters.subs.length === 1 && filters.categories.length <= 1) {
    return getCategoryLabel(filters.subs[0])
  }
  if (filters.categories.length === 1 && filters.subs.length === 0) {
    return getCategoryLabel(filters.categories[0])
  }
  if (filters.categories.length > 1) {
    return `${getCategoryLabel(filters.categories[0])} + ${filters.categories.length - 1} more`
  }
  if (filters.brands.length === 1) {
    const brand = getAllBrandOptions().find((b) => b.slug === filters.brands[0])
    return brand?.label ?? 'Products'
  }
  return 'All Products'
}

/**
 * @param {ProductFilterParams} filters
 */
export function buildBreadcrumbs(filters) {
  /** @type {Array<{ label: string, href?: string }>} */
  const items = [{ label: 'Home', href: '/' }]

  const hasMultiCategory = filters.categories.length > 1 || filters.subs.length > 1
  const hasSingleCategoryPath =
    filters.categories.length === 1 && filters.subs.length <= 1
  const hasSearchOrBrandOnly =
    !filters.categories.length &&
    !filters.subs.length &&
    Boolean(filters.q || filters.brands.length)

  if (!filters.categories.length && !filters.subs.length && !filters.q && !filters.brands.length) {
    items.push({ label: 'Products' })
    return items
  }

  if (hasSingleCategoryPath && !hasMultiCategory) {
    const category = filters.categories[0]
    const sub = filters.subs[0]
    if (category) {
      const hasBrowse = category === 'power-tools'
      items.push({
        label: getCategoryLabel(category),
        href: hasBrowse ? `/category/${category}` : undefined,
      })
    }
    if (sub) {
      const hasBrowse = category === 'power-tools' && sub === 'cordless-drills'
      items.push({
        label: getCategoryLabel(sub),
        href: hasBrowse ? `/category/${category}/${sub}` : undefined,
      })
    } else if (category) {
      items[items.length - 1] = { label: getCategoryLabel(category) }
    }
    return items
  }

  items.push({ label: 'Products', href: '/products' })

  if (hasSearchOrBrandOnly) {
    if (filters.brands.length === 1) {
      const brand = getAllBrandOptions().find((b) => b.slug === filters.brands[0])
      items.push({ label: brand?.label ?? filters.brands[0] })
    } else if (filters.q) {
      items.push({ label: `Search: ${filters.q}` })
    }
  }

  return items
}

/** @param {string[]} list @param {string} slug */
export function toggleListValue(list, slug) {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
}

export { PAGE_SIZE }
