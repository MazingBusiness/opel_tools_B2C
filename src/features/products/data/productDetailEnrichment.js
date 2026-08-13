/** Enrich listing products with detail-page fields — replace with API later. */

const u = (id, w = 600, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

const GALLERY_KEYS = ['drill', 'grinder', 'workshop', 'bench', 'toolbox']
const IMG = {
  drill: 'photo-1572981779307-38b8cabb2407',
  grinder: 'photo-1504328345606-18bbc8c9d7d1',
  workshop: 'photo-1504148455328-c376907d081c',
  bench: 'photo-1581091226825-a6a2a5aee158',
  toolbox: 'photo-1530124566582-a618bc2615dc',
}

const REVIEW_AUTHORS = [
  'Ravi Sharma',
  'Anjali Mehta',
  'Manoj Tiwari',
  'Pooja Reddy',
]

const REVIEW_COMMENTS = [
  'Solid build quality and performs exactly as advertised. Used it on a full day of site work without issues.',
  'Good value for the price. Comfortable to use for extended periods and the included accessories are handy.',
  'Reliable tool for everyday jobs. Delivery was quick and packaging was secure. Would buy again.',
  'Works well for home improvement projects. Instructions were clear and setup took only a few minutes.',
]

/**
 * @param {object} product - Base catalog product
 */
export function buildProductDetail(product) {
  const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const galleryOffset = hash % GALLERY_KEYS.length

  const images = [
    product.imageUrl,
    ...GALLERY_KEYS.slice(0, 4).map((key, index) =>
      u(IMG[GALLERY_KEYS[(galleryOffset + index) % GALLERY_KEYS.length]]),
    ),
  ]

  const highlights = [
    'Industrial-grade construction for demanding job sites',
    'Ergonomic grip reduces fatigue during extended use',
    'Compatible with standard accessories and consumables',
    'Backed by manufacturer warranty and OPEL support',
  ]

  const specs = [
    { label: 'Brand', value: product.brandSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'Category', value: product.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'Sub-category', value: product.subCategorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: 'SKU', value: `OPEL-${product.id.toUpperCase().replace(/-/g, '')}` },
    { label: 'Warranty', value: '12 months manufacturer warranty' },
    { label: 'Country of origin', value: 'India' },
  ]

  const reviews = REVIEW_AUTHORS.map((author, index) => ({
    id: `${product.id}-review-${index + 1}`,
    author,
    date: new Date(2025, 4 + (index % 3), 10 + index * 3).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    rating: Math.min(5, Math.max(3, Math.round(product.rating) - (index % 2))),
    comment: REVIEW_COMMENTS[index],
  }))

  return {
    ...product,
    description: `${product.title} — professional-grade tool built for performance and durability on every job.`,
    longDescription: `${product.title} is engineered for professionals and serious DIY users who need reliable performance day after day. With robust materials, precision manufacturing, and thoughtful ergonomics, this tool delivers consistent results across a wide range of applications. Ideal for workshop, site, and home use. Includes standard warranty coverage and is supported by OPEL Tools service network across India.`,
    images,
    highlights,
    specs,
    sku: `OPEL-${product.id.toUpperCase().replace(/-/g, '')}`,
    inStock: hash % 7 !== 0,
    reviews,
  }
}
