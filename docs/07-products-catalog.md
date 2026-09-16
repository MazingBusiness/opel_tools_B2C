# Products Catalog

## Overview

The catalog covers product listing ([`/products`](../src/features/products/pages/ProductsPage.jsx)) and product detail ([`/products/:productId`](../src/features/products/pages/ProductDetailPage.jsx)). Filters, search, sort, and pagination are **URL-driven** via query params and backed by `GET /api/v1/products` — no filter state in Zustand.

Legacy route `/products?id={productId}` redirects to `/products/{productId}`.

## Key files

| Path | Role |
| --- | --- |
| [`features/products/pages/ProductsPage.jsx`](../src/features/products/pages/ProductsPage.jsx) | Listing page — sidebar, toolbar, grid, pagination |
| [`features/products/pages/ProductDetailPage.jsx`](../src/features/products/pages/ProductDetailPage.jsx) | PDP — gallery, buy box, tabs, related products |
| [`features/products/hooks/useProductFilters.js`](../src/features/products/hooks/useProductFilters.js) | URL ↔ filter state bridge |
| [`features/products/hooks/useProductDetail.js`](../src/features/products/hooks/useProductDetail.js) | Resolves product + related + breadcrumbs |
| [`features/products/utils/productFilters.js`](../src/features/products/utils/productFilters.js) | Parse/serialize params, filter, sort, paginate |
| [`features/products/utils/categoryTaxonomy.js`](../src/features/products/utils/categoryTaxonomy.js) | Category/sub/brand slug helpers |
| [`features/products/api/`](../src/features/products/api/) | Catalog HTTP client, mappers, React Query hooks |
| [`features/products/data/productCatalog.js`](../src/features/products/data/productCatalog.js) | Legacy mock catalog (PDP / related until wired) |
| [`features/products/data/productDetailEnrichment.js`](../src/features/products/data/productDetailEnrichment.js) | Extra PDP fields (specs, reviews, images) |
| [`shared/components/ProductCard.jsx`](../src/shared/components/ProductCard.jsx) | Shared card with cart/wishlist actions |
| [`shared/components/ProductGallery.jsx`](../src/shared/components/ProductGallery.jsx) | Image gallery (PDP) |

## URL filter params

Parsed by [`parseFilterParams()`](../src/features/products/utils/productFilters.js) and sent to `GET /api/v1/products`:

| Param | Type | API field | Example |
| --- | --- | --- | --- |
| `group` | comma-separated group slugs | `cat_groups` (IDs) | `power-tools` |
| `category` | comma-separated category slugs | `categories` (IDs) | `drills` |
| `brand` | comma-separated brand slugs | `brands` (IDs) | `bosch` |
| `q` | search string | `q` | `drill` |
| `min` / `max` | price range | `min` / `max` | `1000` / `50000` |
| `in_stock` | `1` when set | `in_stock` | `1` |
| `sort` | sort key | `sort` | `price_low_to_high`, `price_high_to_low`, `new_arrival`, `relevance` |
| `page` | page number (1-based) | `page` | `2` |
| `per_page` | optional | `per_page` (max 50) | default **24** |

[`useProductFilters`](../src/features/products/hooks/useProductFilters.js) keeps filters in the URL, loads brands/category-groups from the API, resolves slugs→IDs, and fetches the product page with React Query. Facet counts come from the products response. Sidebar filters apply immediately; mobile drawer uses draft state until "Apply".

## Product shape (listing)

Mapped from `ProductListResource` for [`ProductCard`](../src/shared/components/ProductCard.jsx):

```js
{
  id, title, imageUrl,
  rating: 0, reviewCount: 0, // not on list API yet
  currentPrice, // unit_price
  originalPrice, // mrp ?? list_price
  discountPercentage,
  inStock, slug, brandSlug, categorySlug, groupSlug,
}
```

PDP enrichment adds `images[]`, `description`, `specs`, `reviews`, `brandLabel`, etc. via [`productDetailEnrichment.js`](../src/features/products/data/productDetailEnrichment.js).

## ProductsPage layout

```
Breadcrumb
├── Sidebar (desktop) — ProductFiltersSidebar
├── Toolbar — sort, result count, mobile filter button
├── ActiveFilterChips
├── ProductResultsGrid
└── ProductPagination
```

Mobile filters open [`ProductFiltersDrawer`](../src/features/products/components/ProductFiltersDrawer.jsx) with draft-then-apply pattern.

## ProductDetailPage layout

```
Breadcrumb
├── ProductGallery + ProductBuyBox (2-col on lg)
├── ProductDetailTabs (description, specs, reviews)
└── RelatedProductsRow
```

[`ProductBuyBox`](../src/features/products/components/ProductBuyBox.jsx) handles quantity, add to cart, buy now, and wishlist via `useCart` / `useWishlist` hooks.

## ProductCard (shared)

Used on homepage rails, listing grid, related products, category spotlights. Wired to cart and wishlist through feature hooks — not UI-only.

Fields: `id`, `title`, `imageUrl`, `rating`, `reviewCount`, `currentPrice`, `originalPrice`, `discountPercentage`. Link href derived from `getProductDetailHref(id)`.

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `getAllProducts()` from static JS | `useProducts()` React Query hook |
| `getFilterFacets()` computed client-side | `GET /products/facets?{params}` |
| `productDetailEnrichment.js` merge | `GET /products/:id` full DTO |
| Client-side filter/sort/paginate | Server-side query params (keep same URL shape) |

**Stable contracts:**

- Route `/products/:productId`
- URL query param names (`category`, `sub`, `brand`, `q`, `min`, `max`, `ratingMin`, `sort`, `page`)
- ProductCard field set (maps to API product summary DTO)
- Filter sidebar / drawer UX pattern

**Likely to change:**

- In-memory catalog size and dummy Unsplash images
- Enrichment as a separate merge step (API returns full product)

## Related

- [04-homepage.md](./04-homepage.md)
- [08-category-browse.md](./08-category-browse.md)
- [09-cart-wishlist.md](./09-cart-wishlist.md)
