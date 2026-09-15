# Orders & Tracking

## Overview

Order tracking is **public** — no login required to look up an order by ID. Logged-in users additionally see their active orders on the lookup page and full history under `/profile/orders`.

Routes:

- `/orders` — lookup form + optional active-orders list
- `/orders/:orderId` — same page with result rendered

## Key files

| Path | Role |
| --- | --- |
| [`features/order/pages/OrdersPage.jsx`](../src/features/order/pages/OrdersPage.jsx) | Public track-order page |
| [`app/store/useOrdersStore.js`](../src/app/store/useOrdersStore.js) | Per-user orders + public lookup |
| [`features/user/data/mockOrders.js`](../src/features/user/data/mockOrders.js) | Seed order data |
| [`features/user/components/OrderTimeline.jsx`](../src/features/user/components/OrderTimeline.jsx) | Fulfillment step indicator |
| [`features/user/components/OrderCard.jsx`](../src/features/user/components/OrderCard.jsx) | Order summary card (profile) |
| [`features/checkout/utils/createOrder.js`](../src/features/checkout/utils/createOrder.js) | Order shape from checkout |

## Lookup flow

1. User enters order ID (form defaults to demo ID `OPL-26091`)
2. Submit navigates to `/orders/{id}`
3. [`findOrderById(id)`](../src/app/store/useOrdersStore.js) searches:
   - All persisted user orders in `byUserId`
   - Fallback to `mockOrders` seed data
4. Found → renders timeline, items, delivery address
5. Not found → empty state with links to retry or profile orders

Logged-in users with active orders (`processing` or `shipped`) see a short list below the form on `/orders`.

## Order shape

```js
{
  id,                    // e.g. 'OPL-26091'
  placedAt,              // ISO string
  status,                // 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod, paymentRef?,
  shippingAddress: { name, phone, line1, line2, city, state, pincode },
  items: [{ productId, title, imageUrl, unitPrice, qty, href }],
  timeline: [{ key, label, at, done, current }],
}
```

[`orderItemsTotal()`](../src/features/user/data/mockOrders.js) sums `unitPrice × qty` for display.

## useOrdersStore

Persisted to `localStorage` key `opel-orders`:

| Method | Purpose |
| --- | --- |
| `ensureSeeded(userId)` | Copies `mockOrders` into `byUserId[userId]` on first access |
| `getOrders(userId)` | Returns user's order array |
| `getOrderById(userId, orderId)` | Single order for profile detail |
| `findOrderById(orderId)` | Public lookup across all users + mock seed |
| `addOrder(userId, order)` | Prepends new order (from checkout) |

Checkout calls `addOrder` after successful payment. Profile pages use `getOrders` / `getOrderById`.

## OrderTimeline

Renders vertical steps from `order.timeline[]`:

```js
{ key, label, at, done, current }
```

`done` = completed step, `current` = active in-progress step. Used on both public tracking and profile order detail.

## Guest vs logged-in

| Feature | Guest | Logged in |
| --- | --- | --- |
| Lookup by ID | Yes | Yes |
| Active orders list on `/orders` | No | Yes |
| Full order history | No | `/profile/orders` |
| Order detail with actions | No | `/profile/orders/:orderId` |
| Link from track result to profile | No | "View full order details" |

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `mockOrders.js` seed + local `addOrder` | `GET /orders`, `GET /orders/:id` |
| `findOrderById` scans localStorage | `GET /orders/track/:id` (guest token or order ID + email/phone) |
| `ensureSeeded` copies static array | API returns user's orders on login |
| Static timeline progression | Webhook-driven status updates |

**Stable contracts:**

- Order ID format exposure in UI (`OPL-*`)
- Route `/orders/:orderId`
- Order DTO fields (items, shippingAddress, timeline, status)
- Status enum values
- Public lookup UX (form + result)

**Likely to change:**

- Guest lookup may require email/phone verification
- Demo default order ID in form placeholder
- Timeline steps and status granularity

## Related

- [10-checkout.md](./10-checkout.md)
- [12-profile-account.md](./12-profile-account.md)
- [06-auth.md](./06-auth.md)
