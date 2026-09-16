/**
 * Map Laravel ProductListResource → ProductCard props.
 * @param {Record<string, unknown>} item
 */
export function mapProductListItem(item) {
  const current = Number(item.unit_price ?? 0)
  const originalRaw = item.mrp ?? item.list_price ?? item.unit_price
  const original = Number(originalRaw ?? current)
  const discountPercentage =
    original > current && original > 0
      ? Math.round(((original - current) / original) * 100)
      : 0

  return {
    id: String(item.id),
    title: String(item.name ?? ''),
    imageUrl: item.thumbnail_img ? String(item.thumbnail_img) : '',
    rating: 0,
    reviewCount: 0,
    currentPrice: current,
    originalPrice: original > 0 ? original : current,
    discountPercentage,
    inStock: Boolean(item.in_stock),
    slug: item.slug ? String(item.slug) : '',
    brandSlug: item.brand && typeof item.brand === 'object' && item.brand.slug
      ? String(item.brand.slug)
      : '',
    categorySlug:
      item.category && typeof item.category === 'object' && item.category.slug
        ? String(item.category.slug)
        : '',
    groupSlug:
      item.group && typeof item.group === 'object' && item.group.slug
        ? String(item.group.slug)
        : '',
  }
}

/**
 * @param {unknown} response
 */
export function mapProductsIndexResponse(response) {
  const body = response && typeof response === 'object' ? response : {}
  const data = Array.isArray(body.data) ? body.data : []
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : {}
  const facets = body.facets && typeof body.facets === 'object' ? body.facets : {}

  const items = data.map(mapProductListItem)
  const total = Number(meta.total ?? items.length)
  const page = Number(meta.current_page ?? 1)
  const pageSize = Number(meta.per_page ?? (items.length || 24))
  const totalPages = Number(
    meta.last_page ?? Math.max(1, Math.ceil(total / (pageSize || 1))),
  )
  const startIndex = Number(
    meta.from ?? (total === 0 ? 0 : (page - 1) * pageSize + 1),
  )
  const endIndex = Number(
    meta.to ?? (total === 0 ? 0 : Math.min(page * pageSize, total)),
  )

  return {
    items,
    pagination: {
      items,
      total,
      page,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
    },
    facets: {
      groups: Array.isArray(facets.groups) ? facets.groups : [],
      categories: Array.isArray(facets.categories) ? facets.categories : [],
      brands: Array.isArray(facets.brands) ? facets.brands : [],
      priceMin: facets.min_price != null ? Number(facets.min_price) : null,
      priceMax: facets.max_price != null ? Number(facets.max_price) : null,
    },
  }
}

/**
 * @param {Array<{ id: number, count: number }>} facetList
 * @returns {Map<number, number>}
 */
export function facetCountMap(facetList) {
  const map = new Map()
  for (const row of facetList ?? []) {
    map.set(Number(row.id), Number(row.count) || 0)
  }
  return map
}
