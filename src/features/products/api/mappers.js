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



/** Display blank API fields as a dash in the PDP. */
export function apiText(value) {
  if (value == null) return '-'
  const s = String(value).trim()
  return s === '' ? '-' : s
}

/**
 * Pick default / first in-stock / first variant from ProductDetailResource.
 * @param {Array<Record<string, unknown>>} variants
 */
function pickDefaultVariant(variants) {
  if (!variants.length) return null
  return (
    variants.find((v) => v.is_default) ||
    variants.find((v) => v.in_stock) ||
    variants[0]
  )
}

/**
 * Normalize photos field (array of urls, or nested data).
 * Gallery uses photos only — do not prepend thumbnail_img.
 * @param {unknown} photos
 * @returns {string[]}
 */
function normalizePhotoUrls(photos) {
  if (!photos) return []
  const rows = Array.isArray(photos)
    ? photos
    : Array.isArray(photos?.data)
      ? photos.data
      : []
  return rows
    .map((row) => {
      if (typeof row === 'string') return row
      if (row && typeof row === 'object') {
        return String(row.url ?? row.path ?? row.thumbnail_img ?? '')
      }
      return ''
    })
    .filter(Boolean)
}

/**
 * Map Laravel ProductDetailResource → PDP view model (BuyBox / tabs / gallery).
 * Only surface API values; empty strings become "-" for display fields.
 * @param {unknown} response
 */
export function mapProductDetail(response) {
  const body =
    response && typeof response === 'object' && response.data != null
      ? response.data
      : response && typeof response === 'object'
        ? response
        : {}

  const variantsRaw = Array.isArray(body.variants)
    ? body.variants
    : Array.isArray(body.variants?.data)
      ? body.variants.data
      : []

  const variants = variantsRaw.map((v) => ({
    id: v.id != null ? String(v.id) : '',
    partNo: v.part_no != null ? String(v.part_no) : '',
    label: v.label != null ? String(v.label) : '',
    options: v.options && typeof v.options === 'object' ? v.options : {},
    unitPrice: Number(v.unit_price ?? 0),
    listPrice: Number(v.list_price ?? v.unit_price ?? 0),
    mrp: Number(v.mrp ?? v.list_price ?? v.unit_price ?? 0),
    currentStock: Number(v.current_stock ?? 0),
    inStock: Boolean(v.in_stock),
    minQty: Number(v.min_qty ?? 1),
    thumbnailImg: v.thumbnail_img ? String(v.thumbnail_img) : '',
    isDefault: Boolean(v.is_default),
  }))

  const defaultVariant = pickDefaultVariant(variantsRaw)
  const current = Number(defaultVariant?.unit_price ?? 0)
  const originalRaw =
    defaultVariant?.mrp ?? defaultVariant?.list_price ?? defaultVariant?.unit_price
  const original = Number(originalRaw ?? current)
  const discountPercentage =
    original > current && original > 0
      ? Math.round(((original - current) / original) * 100)
      : 0

  const thumb = body.thumbnail_img ? String(body.thumbnail_img) : ''
  // Gallery: photos only (do not include thumbnail_img).
  const images = [...new Set(normalizePhotoUrls(body.photos))]

  const brand =
    body.brand && typeof body.brand === 'object' && !Array.isArray(body.brand)
      ? body.brand
      : null
  const category =
    body.category && typeof body.category === 'object' && !Array.isArray(body.category)
      ? body.category
      : null
  const group =
    body.group && typeof body.group === 'object' && !Array.isArray(body.group)
      ? body.group
      : null

  const descriptionRaw =
    body.description != null ? String(body.description).trim() : ''
  const title = apiText(body.name)
  const partNo = defaultVariant?.part_no != null ? String(defaultVariant.part_no).trim() : ''
  const hsn = body.hsncode != null ? String(body.hsncode).trim() : ''
  const skuRaw = partNo || hsn

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : []

  /** Specs always list known API fields; blank → "-". */
  const specs = [
    { label: 'Brand', value: apiText(brand?.name) },
    { label: 'Category group', value: apiText(group?.name) },
    { label: 'Category', value: apiText(category?.name) },
    { label: 'SKU / Part no', value: apiText(skuRaw) },
    { label: 'HSN', value: apiText(hsn) },
    { label: 'Unit', value: apiText(body.unit) },
    {
      label: 'Min qty',
      value: body.min_qty != null ? String(body.min_qty) : '-',
    },
    {
      label: 'Piece per carton',
      value:
        body.piece_per_carton != null ? String(body.piece_per_carton) : '-',
    },
  ]

  const categoryId = category?.id != null ? Number(category.id) : null

  return {
    id: String(body.id ?? ''),
    title,
    slug: body.slug ? String(body.slug) : '',
    // Card/cart thumbnail (separate from gallery).
    imageUrl: thumb,
    images,
    // Ratings/reviews not in ProductDetailResource yet — leave empty (no invented copy).
    // rating: 0,
    // reviewCount: 0,
    // reviews: [],
    rating: null,
    reviewCount: null,
    reviews: [],
    currentPrice: current,
    originalPrice: original > 0 ? original : current,
    discountPercentage,
    inStock: Boolean(body.in_stock),
    // No synthetic description fallbacks — API text or "-".
    description: apiText(descriptionRaw),
    longDescription: apiText(descriptionRaw),
    // Tags from API only (may be empty).
    highlights: tags,
    specs,
    sku: apiText(skuRaw),
    brandSlug: brand?.slug ? String(brand.slug) : '',
    brandLabel: apiText(brand?.name ?? brand?.slug),
    categorySlug: category?.slug ? String(category.slug) : '',
    categoryId,
    categoryLabel: apiText(category?.name),
    subCategorySlug: category?.slug ? String(category.slug) : '',
    groupSlug: group?.slug ? String(group.slug) : '',
    groupLabel: apiText(group?.name),
    hasVariants: Boolean(body.has_variants),
    optionGroups: Array.isArray(body.option_groups) ? body.option_groups : [],
    variants,
    selectedVariantId: defaultVariant?.id != null ? String(defaultVariant.id) : null,
    minQty: Number(body.min_qty ?? defaultVariant?.min_qty ?? 1),
    href: body.id != null ? `/products/${body.id}` : '/products',
  }
}
