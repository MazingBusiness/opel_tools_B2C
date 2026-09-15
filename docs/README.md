# OPEL Tools B2C — Developer Docs

Internal documentation for the B2C storefront. Read in order for onboarding; feature docs (04–13) can be read independently.

## Setup & architecture

| # | Doc | Description |
| --- | --- | --- |
| 01 | [Project initialisation](./01-project-initialisation.md) | Stack, setup, scripts |
| 02 | [Dependencies](./02-dependencies.md) | npm packages, Tailwind, brand tokens |
| 03 | [Folder structure](./03-folder-structure.md) | `src/` layout, conventions, B2B mapping |

## Features

| # | Doc | Description |
| --- | --- | --- |
| 04 | [Homepage](./04-homepage.md) | Hero, category bands, banner strips |
| 05 | [Layout & navigation](./05-layout-navigation.md) | MainLayout, header, footer, drawers |
| 06 | [Authentication](./06-auth.md) | Auth modal, session, route guards |
| 07 | [Products catalog](./07-products-catalog.md) | Listing, filters, product detail |
| 08 | [Category browse](./08-category-browse.md) | Category pages, mega menu mapping |
| 09 | [Cart & wishlist](./09-cart-wishlist.md) | Stores, drawers, seed data |
| 10 | [Checkout](./10-checkout.md) | Stepper, payment sim, order creation |
| 11 | [Orders & tracking](./11-orders-tracking.md) | Public lookup, order timeline |
| 12 | [Profile & account](./12-profile-account.md) | Dashboard, addresses, orders, security |
| 13 | [Location & pincode](./13-location-pincode.md) | Delivery location dialog |

## Conventions

- Plain Markdown, no frontmatter
- Numbered filenames: `{NN}-{kebab-topic}.md`
- Each feature doc includes a **Dummy data & API migration** section — update those first when wiring APIs
- In-app policy pages (`src/features/content/`) are CMS placeholders and not covered here

## User flow (quick reference)

```
Browse (home → category/products → PDP)
  → Cart / Wishlist
  → Checkout (auth required)
  → Orders / Profile
```

Auth modal and location dialog are available globally from the header.
