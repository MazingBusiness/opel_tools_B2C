# Category Browse

## Overview

Category pages live at `/category/:categorySlug` and `/category/:categorySlug/:subSlug`. Only **Power Tools** has a full browse experience today; other category nav tabs link to filtered product listing (`/products?category={slug}`) instead.

[`CategoryBrowsePage`](../src/features/category/pages/CategoryBrowsePage.jsx) composes a hero carousel, subcategory strip, child spotlight rows, and a product grid. Unknown slugs redirect to the equivalent products URL.

## Key files

| Path | Role |
| --- | --- |
| [`features/category/pages/CategoryBrowsePage.jsx`](../src/features/category/pages/CategoryBrowsePage.jsx) | Category page composition |
| [`features/category/data/categoryCatalog.js`](../src/features/category/data/categoryCatalog.js) | Category tree + hero/spotlight data |
| [`features/category/components/SubcategoryStrip.jsx`](../src/features/category/components/SubcategoryStrip.jsx) | Horizontal subcategory links |
| [`features/category/components/ChildSpotlightRow.jsx`](../src/features/category/components/ChildSpotlightRow.jsx) | Brand strip + product rail per subcategory |
| [`features/category/components/CategoryProductGrid.jsx`](../src/features/category/components/CategoryProductGrid.jsx) | Full product grid at page bottom |
| [`app/layout/categoryNavData.js`](../src/app/layout/categoryNavData.js) | Header nav → slug mapping |
| [`app/layout/CategoryNav.jsx`](../src/app/layout/CategoryNav.jsx) | Tab href logic |
| [`shared/components/HeroCarousel.jsx`](../src/shared/components/HeroCarousel.jsx) | Category hero banners |

## Route resolution

[`getCategoryNode(categorySlug, subSlug)`](../src/features/category/data/categoryCatalog.js) returns `{ node, breadcrumbs }` or `null`.

| Input | Result |
| --- | --- |
| Valid slug(s) | Renders category page |
| Invalid slug | `<Navigate>` to `/products?category={slug}` fallback |

**Nav → route mapping** ([`CategoryNav.jsx`](../src/app/layout/CategoryNav.jsx)):

| Category | Tab href |
| --- | --- |
| `power-tools` | `/category/power-tools` |
| All others | `/products?category={slug}` |

Mega-menu subcategory links use `/category/{categorySlug}/{subSlug}`.

## Category node shape

```js
{
  slug, title, description?,
  heroSlides: [{ id, imageUrl, linkUrl }],
  children: [{ slug, title, imageUrl, href }],
  childSpotlights?: [{
    childSlug, title, viewAllHref,
    brands: [{ id, name, logoUrl, href }],
    products: [/* ProductCard fields */],
  }],
  products: [/* ProductCard fields for grid */],
}
```

## Page composition

```
Breadcrumb
HeroCarousel (category banners)
Header (title + description)
SubcategoryStrip (children links)
ChildSpotlightRow × N (alternating muted panels)
CategoryProductGrid (all category products)
```

Spotlight rows mirror homepage [`CategorySection`](../src/features/home/components/CategorySection.jsx) layout — brand strip + product rail per subcategory.

## Relationship to products listing

Category browse and products listing share:

- [`productCatalog.js`](../src/features/products/data/productCatalog.js) for product data
- [`ProductCard`](../src/shared/components/ProductCard.jsx) for tiles
- Category slugs from [`categoryTaxonomy.js`](../src/features/products/utils/categoryTaxonomy.js)

Category pages are **curated landing experiences**; `/products?category=` is the **filterable catalog view**.

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `categoryCatalog.js` static tree | `GET /categories/:slug` CMS/catalog API |
| Hardcoded Power Tools browse page | Dynamic category template for all slugs |
| Unsplash hero/brand images | CDN URLs from API |
| `categoryNavData.js` separate from catalog | Single category tree API feeding nav + browse |

**Stable contracts:**

- Route pattern `/category/:categorySlug/:subSlug?`
- Category slug namespace (matches filter `category` param)
- Node shape fields (`heroSlides`, `children`, `childSpotlights`, `products`)
- Fallback redirect to `/products?category=` on unknown slug

**Likely to change:**

- Only Power Tools having a full browse page (extend to all categories post-API)
- Duplicate data between `categoryNavData.js` and `categoryCatalog.js` (consolidate)

## Related

- [04-homepage.md](./04-homepage.md)
- [05-layout-navigation.md](./05-layout-navigation.md)
- [07-products-catalog.md](./07-products-catalog.md)
