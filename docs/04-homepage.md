# Homepage Composition

## Overview

The homepage ([`HomePage.jsx`](../src/features/home/pages/HomePage.jsx)) stacks:

1. **Hero slider** (Embla + autoplay)
2. **Category sections** interleaved with **static banner strips**

```
HeroSlider
CategorySection (Power Tools)
BannerSection (brand promos — 4 tiles)
CategorySection (Hand Tools)
BannerSection (service promos — 3 tiles)
CategorySection (Accessories)
```

UI is marketplace-inspired but OPEL-branded (teal / black / gold). Dummy data uses Unsplash until APIs land.

## Key files

| Path | Role |
| --- | --- |
| [`features/home/pages/HomePage.jsx`](../src/features/home/pages/HomePage.jsx) | Composes hero + categories + banners |
| [`features/home/components/HeroSlider.jsx`](../src/features/home/components/HeroSlider.jsx) | Full-width promo carousel |
| [`features/home/components/CategorySection.jsx`](../src/features/home/components/CategorySection.jsx) | Reusable category band |
| [`features/home/components/FeaturedSubCard.jsx`](../src/features/home/components/FeaturedSubCard.jsx) | Image-led subcategory tile |
| [`features/home/components/BannerSection.jsx`](../src/features/home/components/BannerSection.jsx) | Static multi-banner grid (not a carousel) |
| [`features/home/components/BannerCard.jsx`](../src/features/home/components/BannerCard.jsx) | Single promo / utility banner |
| [`features/home/data/heroSlides.js`](../src/features/home/data/heroSlides.js) | Hero slide list |
| [`features/home/data/categorySections.js`](../src/features/home/data/categorySections.js) | Category band payloads |
| [`features/home/data/bannerSections.js`](../src/features/home/data/bannerSections.js) | Banner strips between categories |
| [`shared/components/ProductCard.jsx`](../src/shared/components/ProductCard.jsx) | Shared product card (listings, rails, etc.) |
| [`shared/utils/formatPrice.js`](../src/shared/utils/formatPrice.js) | INR formatting helper |

## CategorySection (generic)

Pass props — do not hardcode category copy in the component:

```js
{
  id: 'power-tools',
  title: 'Power Tools',
  viewAllHref: '/products?category=power-tools',
  brands: [{ id, name, logoUrl, href }],
  featuredSubCategories: [{ id, title, imageUrl, href }],
  products: [/* ProductCard fields */],
}
```

Layout inside each band:

1. Header (title + View all)
2. Brand strip (dark panel, square tiles) + featured subcategory grid
3. Product rail (Embla — horizontal scroll, not the banner section)

### Add another category

1. Append an object to `categorySections` in [`categorySections.js`](../src/features/home/data/categorySections.js).
2. Optionally append a matching entry to `bannerSections` (index `N` renders **after** `categorySections[N]`, and **not** after the last category).

`HomePage` already maps both arrays — no page change required.

## BannerSection (static)

- **Not** a carousel — responsive CSS grid only.
- Grid columns adapt to banner count (1 / 2 / 3 / 4+).
- `BannerCard` tones: `muted` | `sand` | `brand` | `brandDark` | `ink` | `surface`.

Banner payload shape:

```js
{
  id, eyebrow?, title, subtitle?, badge?, ctaLabel, href, imageUrl, tone?
}
```

## ProductCard (shared)

Used by category product rails; live under `shared/` so products listing / search / cart recs can reuse it.

Consistent height via:

- `flex flex-col h-full`
- Square image (`aspect-square`)
- Title `line-clamp-2` + min-height
- Price + CTAs with `mt-auto`

Fields: `id`, `title`, `imageUrl`, `rating`, `reviewCount`, `currentPrice`, `originalPrice`, `discountPercentage`, `href?`.

Cart / buy actions are UI-only for now (no Zustand cart wiring yet).

## Embla usage

| Surface | Embla? |
| --- | --- |
| Hero slider | Yes (+ autoplay) |
| Category product rail | Yes |
| Banner strip | **No** — static grid |

## Related

- [03-folder-structure.md](./03-folder-structure.md)
- [02-dependencies.md](./02-dependencies.md)
