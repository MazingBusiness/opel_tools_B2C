# Layout & Navigation

## Overview

Every public page nests under [`MainLayout.jsx`](../src/app/layout/MainLayout.jsx). The shell provides a sticky header stack, scrollable `<Outlet />`, footer, and four global overlays (auth modal, cart drawer, wishlist drawer, location dialog).

```
MainLayout
├── Header (sticky)
│   ├── TopBar          — promo strip
│   ├── MainBar         — logo, location, search, header actions
│   └── CategoryNav     — category tabs + hover/tap mega menu
├── <main><Outlet /></main>
├── Footer
├── AuthModal
├── CartDrawer
├── WishlistDrawer
└── LocationDialog
```

Routes are defined in [`AppRoutes.jsx`](../src/app/router/AppRoutes.jsx). Auth-guarded routes (`/checkout`, `/profile/*`) wrap in [`RequireAuth`](../src/app/router/RequireAuth.jsx) — see [06-auth.md](./06-auth.md).

## Key files

| Path | Role |
| --- | --- |
| [`app/layout/MainLayout.jsx`](../src/app/layout/MainLayout.jsx) | App shell — header, outlet, footer, overlays |
| [`app/layout/Header.jsx`](../src/app/layout/Header.jsx) | Composes TopBar + MainBar + CategoryNav |
| [`app/layout/TopBar.jsx`](../src/app/layout/TopBar.jsx) | Promo strip above main bar |
| [`app/layout/MainBar.jsx`](../src/app/layout/MainBar.jsx) | Logo, location button, search, header actions |
| [`app/layout/HeaderSearch.jsx`](../src/app/layout/HeaderSearch.jsx) | Search input → `/products?q=` |
| [`app/layout/HeaderActions.jsx`](../src/app/layout/HeaderActions.jsx) | Login/account, wishlist, track order, cart |
| [`app/layout/CategoryNav.jsx`](../src/app/layout/CategoryNav.jsx) | Category tabs + mega menu trigger |
| [`app/layout/CategoryMegaMenu.jsx`](../src/app/layout/CategoryMegaMenu.jsx) | Hover/tap dropdown panel |
| [`app/layout/categoryNavData.js`](../src/app/layout/categoryNavData.js) | Static nav + mega-menu data |
| [`app/layout/Footer.jsx`](../src/app/layout/Footer.jsx) | Trust strip, link columns, contact, legal |
| [`app/store/useUiStore.js`](../src/app/store/useUiStore.js) | Modal/drawer open state |

## Header actions

[`HeaderActions.jsx`](../src/app/layout/HeaderActions.jsx) wires the right-side controls:

| Control | Logged out | Logged in |
| --- | --- | --- |
| Account | Opens auth modal | Dropdown: profile, orders, addresses, logout |
| Wishlist | Opens wishlist drawer | Same (badge from `useWishlistStore`) |
| Track Order | Link to `/orders` | Same |
| Cart | Opens cart drawer | Same (badge from `useCartStore`) |

Cart and wishlist drawers are mutually exclusive — opening one closes the other via `useUiStore`.

## Category navigation

[`categoryNavData.js`](../src/app/layout/categoryNavData.js) defines six top-level categories with nested mega-menu groups. Each item has `id`, `label`, `icon`, `slug`, and `groups[]` (title + link slugs).

**Route mapping** ([`CategoryNav.jsx`](../src/app/layout/CategoryNav.jsx)):

| Category slug | Tab link |
| --- | --- |
| `power-tools` | `/category/power-tools` |
| All others | `/products?category={slug}` |

Mega-menu subcategory links resolve to `/category/{slug}/{subSlug}` or filtered product URLs. Active tab state derives from the current pathname and `?category=` query param.

**Touch devices:** On `(hover: none)`, tapping a category tab toggles the mega menu instead of navigating immediately.

## Footer

[`Footer.jsx`](../src/app/layout/Footer.jsx) is data-driven via inline arrays:

- **Trust strip** — four value props (tools, delivery, checkout, support)
- **Link columns** — Company, Help, Shop, Policies (see routes in file)
- **Contact + social** — email + placeholder social links
- **Legal bar** — Terms, Privacy, Warranty

Shop column links all point to `/products` for now (Best Sellers / New Arrivals are placeholders).

## UI store

[`useUiStore`](../src/app/store/useUiStore.js) holds app-shell UI flags:

```js
{
  isSidebarOpen, setSidebarOpen,
  isAuthModalOpen, openAuthModal, closeAuthModal,
  isCartOpen, openCart, closeCart,
  isWishlistOpen, openWishlist, closeWishlist,
  isLocationDialogOpen, openLocationDialog, closeLocationDialog,
}
```

Do not put remote data here — only transient UI state.

## Dummy data & API migration

| Current | Replace with |
| --- | --- |
| `categoryNavData.js` static tree | CMS or catalog API category tree |
| Footer link arrays inline in `Footer.jsx` | CMS nav config (optional) |
| TopBar promo copy hardcoded | CMS banner / promo API |

**Stable contracts (keep through API integration):**

- Route paths (`/products`, `/category/:slug`, `/profile/*`, etc.)
- `useUiStore` open/close API for overlays
- Header action entry points (modal, drawers, `/orders` link)

## Related

- [03-folder-structure.md](./03-folder-structure.md)
- [06-auth.md](./06-auth.md)
- [08-category-browse.md](./08-category-browse.md)
- [09-cart-wishlist.md](./09-cart-wishlist.md)
- [13-location-pincode.md](./13-location-pincode.md)
