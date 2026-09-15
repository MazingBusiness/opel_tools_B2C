# Checkout

## Overview

Checkout at [`/checkout`](../src/features/checkout/pages/CheckoutPage.jsx) is auth-guarded. It runs a four-step flow:

```
Delivery (address) → Review → Payment → Success
```

Cart must be non-empty; empty cart redirects to `/cart`. On success, an order is created locally, saved to `useOrdersStore`, and the cart is cleared.

## Key files

| Path | Role |
| --- | --- |
| [`features/checkout/pages/CheckoutPage.jsx`](../src/features/checkout/pages/CheckoutPage.jsx) | Page layout + step rendering |
| [`features/checkout/hooks/useCheckout.js`](../src/features/checkout/hooks/useCheckout.js) | Step state, address selection, payment orchestration |
| [`features/checkout/components/CheckoutStepper.jsx`](../src/features/checkout/components/CheckoutStepper.jsx) | Progress indicator (clickable on completed steps) |
| [`features/checkout/components/AddressStep.jsx`](../src/features/checkout/components/AddressStep.jsx) | Select/add delivery address |
| [`features/checkout/components/ReviewStep.jsx`](../src/features/checkout/components/ReviewStep.jsx) | Line items, totals, address summary |
| [`features/checkout/components/PaymentStep.jsx`](../src/features/checkout/components/PaymentStep.jsx) | Payment method + pay button |
| [`features/checkout/components/SuccessStep.jsx`](../src/features/checkout/components/SuccessStep.jsx) | Order confirmation |
| [`features/checkout/components/CheckoutLineItem.jsx`](../src/features/checkout/components/CheckoutLineItem.jsx) | Single line in review |
| [`features/checkout/utils/createOrder.js`](../src/features/checkout/utils/createOrder.js) | Builds order object from cart + address |
| [`features/checkout/api/zohoPayments.js`](../src/features/checkout/api/zohoPayments.js) | Simulated payment gateway |
| [`features/checkout/data/demoCheckoutAddress.js`](../src/features/checkout/data/demoCheckoutAddress.js) | Pre-filled demo address form |
| [`features/checkout/data/paymentMethods.js`](../src/features/checkout/data/paymentMethods.js) | UPI / card / netbanking options |

## Step details

### Delivery (address)

- Lists addresses from `useProfileStore` for the logged-in user
- Select via radio; default address pre-selected
- Inline address form to add new (calls `saveNewAddress` → `addAddress` in profile store)
- "Use demo address" pre-fills from [`demoCheckoutAddress.js`](../src/features/checkout/data/demoCheckoutAddress.js)

### Review

- Shows cart line items, totals ([`CartSummary`](../src/features/cart/components/CartSummary.jsx) variant), selected address
- Links to `/terms` and `/returns`
- "Change address" jumps back to delivery step

### Payment

- Methods: `upi`, `card`, `netbanking` (from `paymentMethods.js`)
- Calls [`simulateZohoPayment()`](../src/features/checkout/api/zohoPayments.js) — artificial delay, always succeeds unless forced fail
- On success: `createOrder()` → `addOrder(userId, order)` → `clearCart()` → step `success`

### Success

- Displays order ID, link to `/profile/orders/{id}` and `/orders/{id}`

## Order shape (created)

[`createOrder()`](../src/features/checkout/utils/createOrder.js) returns:

```js
{
  id,              // OPL-{timestamp suffix}
  placedAt,        // ISO string
  status: 'processing',
  paymentMethod, paymentRef,
  shippingAddress: { name, phone, line1, line2, city, state, pincode },
  items: [{ productId, title, imageUrl, unitPrice, qty, href }],
  timeline: [{ key, label, at, done, current }],
}
```

Timeline starts at "Order placed" (done) with "Packed" as current step.

## useCheckout hook

Centralizes step navigation and payment:

```js
{
  step, stepIndex,
  items, totals,
  addresses, selectedAddressId, selectedAddress,
  paymentMethod, isProcessing, paymentError, placedOrder,
  goToStep, goNext, goBack,
  saveNewAddress, processPayment,
}
```

Reads cart from `useCartStore`, profile addresses from `useProfileStore`, writes orders to `useOrdersStore`.

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `simulateZohoPayment()` | Zoho Payments SDK / server-side payment intent |
| `createOrder()` client-side ID | `POST /orders` returns server order |
| Addresses from profile store | `GET /users/addresses` + checkout address selection API |
| Demo address pre-fill | Remove or gate behind dev flag |
| Client-side cart totals at checkout | Server-validated order summary |

**Stable contracts:**

- Step sequence (address → review → payment → success)
- Order DTO shape (items, shippingAddress, timeline, status)
- `/checkout` auth requirement
- Payment method enum (`upi`, `card`, `netbanking`)

**Likely to change:**

- Order ID format (`OPL-{timestamp}` → server-generated)
- Payment simulation delay and always-success behavior
- Single-page vs multi-step layout

## Related

- [06-auth.md](./06-auth.md)
- [09-cart-wishlist.md](./09-cart-wishlist.md)
- [11-orders-tracking.md](./11-orders-tracking.md)
- [12-profile-account.md](./12-profile-account.md)
