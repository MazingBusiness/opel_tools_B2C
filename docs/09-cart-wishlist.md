# Cart & Wishlist

## Overview

Cart and wishlist share a similar architecture: Zustand stores in `app/store/`, feature hooks wrapping store actions, full pages at `/cart` and `/wishlist`, and slide-over drawers opened from the header.

Both stores **seed dummy items** on first visit (empty persisted state) and persist to `localStorage`.

## Key files

| Path | Role |
| --- | --- |
| [`app/store/useCartStore.js`](../src/app/store/useCartStore.js) | Cart lines + seed logic |
| [`app/store/useWishlistStore.js`](../src/app/store/useWishlistStore.js) | Wishlist items + toggle |
| [`features/cart/hooks/useCart.js`](../src/features/cart/hooks/useCart.js) | Cart hook — add, qty, remove, totals, drawer |
| [`features/wishlist/hooks/useWishlist.js`](../src/features/wishlist/hooks/useWishlist.js) | Wishlist hook — toggle, move to cart |
| [`features/cart/pages/CartPage.jsx`](../src/features/cart/pages/CartPage.jsx) | Full cart page |
| [`features/cart/components/CartDrawer.jsx`](../src/features/cart/components/CartDrawer.jsx) | Header cart overlay |
| [`features/cart/components/CartLineItem.jsx`](../src/features/cart/components/CartLineItem.jsx) | Single cart row |
| [`features/cart/components/CartSummary.jsx`](../src/features/cart/components/CartSummary.jsx) | Totals + checkout CTA |
| [`features/cart/data/mockCart.js`](../src/features/cart/data/mockCart.js) | Seed cart lines |
| [`features/cart/utils/cartTotals.js`](../src/features/cart/utils/cartTotals.js) | Subtotal, discount, shipping, grand total |
| [`features/wishlist/pages/WishlistPage.jsx`](../src/features/wishlist/pages/WishlistPage.jsx) | Full wishlist page |
| [`features/wishlist/components/WishlistDrawer.jsx`](../src/features/wishlist/components/WishlistDrawer.jsx) | Header wishlist overlay |
| [`features/wishlist/data/mockWishlist.js`](../src/features/wishlist/data/mockWishlist.js) | Seed wishlist items |

## Store shapes

**CartLine** (`useCartStore`):

```js
{
  id, productId, title, imageUrl, href,
  unitPrice, originalPrice, discountPercentage,
  qty,  // max MAX_CART_QTY (99)
}
```

**WishlistItem** (`useWishlistStore`):

```js
{
  id, productId, title, imageUrl, href,
  unitPrice, originalPrice, discountPercentage,
  inStock?,
}
```

## Cart actions

| Action | Store method | Hook wrapper |
| --- | --- | --- |
| Add product | `addItem(product, qty?)` | `useCart().addToCart(product, qty, opts?)` |
| Set quantity | `setQty(lineId, qty)` | `useCart().setLineQty` |
| Remove line | `removeItem(lineId)` | `useCart().removeLine` |
| Clear all | `clear()` | Used after checkout success |

`addToCart` optionally opens the cart drawer (`openDrawer: true` default). Buy Now passes `{ openDrawer: false }` and navigates to `/cart`.

## Wishlist actions

| Action | Store method | Hook wrapper |
| --- | --- | --- |
| Add | `addItem(product)` | `useWishlist().addItem` |
| Remove | `removeItem(idOrProductId)` | `useWishlist().removeItem` |
| Toggle | `toggleItem(product)` | `useWishlist().toggleWishlist` |
| Move to cart | — | `useWishlist().moveToCart` (adds to cart, removes from wishlist) |

`hasProduct(productId)` checks membership — used by `ProductCard` and `ProductBuyBox` for heart icon state.

## Seeding

Both stores use the same pattern:

1. Persist `{ items, hasSeeded }` to localStorage
2. On rehydrate, if `!hasSeeded && items.length === 0`, inject seed data
3. Set `hasSeeded: true` so user-cleared carts stay empty

Seed sources: [`mockCart.js`](../src/features/cart/data/mockCart.js), [`mockWishlist.js`](../src/features/wishlist/data/mockWishlist.js).

## Totals

[`getCartTotals(items)`](../src/features/cart/utils/cartTotals.js) returns:

```js
{
  itemCount,        // sum of qty
  subtotal,         // sum of unitPrice × qty
  productDiscount,  // sum of (originalPrice - unitPrice) × qty
  shipping,         // flat rate (free above threshold)
  grandTotal,
}
```

Used by cart page, drawer, checkout sidebar, and header badge count.

## Entry points

| Surface | Add to cart | Toggle wishlist |
| --- | --- | --- |
| `ProductCard` | Cart icon button | Heart icon |
| `ProductBuyBox` (PDP) | Add to Cart + Buy Now | Heart button |
| Wishlist page/drawer | Move to cart | Remove |

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| Local Zustand cart/wishlist | `GET/POST/PATCH/DELETE /cart`, `/wishlist` API |
| Seed data on first visit | Server-side cart for logged-in users; guest cart via cookie/session |
| Client-side totals | Server-computed totals (prices, shipping, tax) |
| `productToCartLine()` local mapping | API returns cart line DTO |

**Stable contracts:**

- CartLine / WishlistItem field set (align with API DTOs)
- `/cart` and `/wishlist` routes
- Drawer + full page dual access pattern
- `useCart` / `useWishlist` hook surface (swap internals to React Query mutations)

**Likely to change:**

- Seed-on-first-visit behavior (API owns initial state)
- Flat shipping calculation in `cartTotals.js`
- Max qty constant (may come from inventory API)

## Related

- [07-products-catalog.md](./07-products-catalog.md)
- [10-checkout.md](./10-checkout.md)
- [05-layout-navigation.md](./05-layout-navigation.md)
