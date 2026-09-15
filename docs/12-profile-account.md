# Profile & Account

## Overview

The account area lives under `/profile/*` behind [`RequireAuth`](../src/app/router/RequireAuth.jsx). [`ProfileLayout`](../src/features/user/pages/ProfileLayout.jsx) wraps a sidebar nav and nested routes for overview, details, addresses, orders, and security.

Wishlist is linked from profile nav but renders at `/wishlist` (not nested under profile).

## Key files

| Path | Role |
| --- | --- |
| [`features/user/pages/ProfileLayout.jsx`](../src/features/user/pages/ProfileLayout.jsx) | Sidebar + mobile nav + `<Outlet />` |
| [`features/user/pages/ProfileOverviewPage.jsx`](../src/features/user/pages/ProfileOverviewPage.jsx) | Dashboard stats + recent orders |
| [`features/user/pages/ProfileDetailsPage.jsx`](../src/features/user/pages/ProfileDetailsPage.jsx) | Name, email, phone, avatar |
| [`features/user/pages/ProfileAddressesPage.jsx`](../src/features/user/pages/ProfileAddressesPage.jsx) | Address list + CRUD |
| [`features/user/pages/ProfileOrdersPage.jsx`](../src/features/user/pages/ProfileOrdersPage.jsx) | Order history list |
| [`features/user/pages/ProfileOrderDetailPage.jsx`](../src/features/user/pages/ProfileOrderDetailPage.jsx) | Single order detail |
| [`features/user/pages/ProfileSecurityPage.jsx`](../src/features/user/pages/ProfileSecurityPage.jsx) | Password + sessions (UI only) |
| [`features/user/data/profileNav.js`](../src/features/user/data/profileNav.js) | Sidebar links |
| [`features/user/hooks/useCurrentProfile.js`](../src/features/user/hooks/useCurrentProfile.js) | `{ user, profile }` for current session |
| [`features/user/utils/profileHelpers.js`](../src/features/user/utils/profileHelpers.js) | Seed profile, completeness, form styles |
| [`app/store/useProfileStore.js`](../src/app/store/useProfileStore.js) | Persisted profiles by user ID |
| [`features/user/components/ProfileSidebar.jsx`](../src/features/user/components/ProfileSidebar.jsx) | Desktop nav |
| [`features/user/components/ProfileMobileNav.jsx`](../src/features/user/components/ProfileMobileNav.jsx) | Horizontal scroll nav (mobile) |
| [`features/user/components/AddressForm.jsx`](../src/features/user/components/AddressForm.jsx) | Add/edit address form |
| [`features/user/components/AddressCard.jsx`](../src/features/user/components/AddressCard.jsx) | Address display + actions |

## Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/profile` | Overview | Stats, completeness, recent orders, quick links |
| `/profile/details` | Details | Edit name, email, phone, avatar |
| `/profile/addresses` | Addresses | CRUD delivery addresses |
| `/profile/orders` | Orders | Full order history |
| `/profile/orders/:orderId` | Order detail | Timeline, items, address, totals |
| `/profile/security` | Security | Change password, active sessions (UI-only) |

## Profile nav

[`PROFILE_NAV`](../src/features/user/data/profileNav.js):

```
Overview · Profile details · Addresses · My orders · Wishlist · Security
```

Wishlist entry points to `/wishlist`. `getProfileSectionLabel(pathname)` resolves the mobile header title.

## Profile store shape

```js
/** UserProfile — keyed by user.id in byUserId */
{
  name, email, phone, avatarUrl,
  passwordSet: boolean,
  addresses: [ProfileAddress],
}

/** ProfileAddress */
{
  id, name, phone,
  line1, line2, city, state, pincode,
  type: 'home' | 'work',
  isDefault: boolean,
}
```

Store methods: `ensureProfile`, `updateProfile`, `addAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`.

On login, [`ensureProfile(user)`](../src/app/store/useProfileStore.js) creates a seed profile via [`createSeedProfile()`](../src/features/user/utils/profileHelpers.js) if none exists. Persisted to `localStorage` key `opel-profile`.

## Screen responsibilities

### Overview

- Stats cards: order count, in-transit, address count, profile completeness %
- Recent orders (from `mockOrders` currently — should use `useOrdersStore` post-integration)
- Quick links to details, addresses, security

### Details

- Edit profile fields; saves via `updateProfile(userId, patch)`
- Avatar upload is UI placeholder

### Addresses

- List [`AddressCard`](../src/features/user/components/AddressCard.jsx) rows with edit/delete/set-default
- [`AddressForm`](../src/features/user/components/AddressForm.jsx) for add/edit
- Addresses shared with checkout ([`useCheckout`](../src/features/checkout/hooks/useCheckout.js) reads same store)

### Orders

- Lists orders from `useOrdersStore.getOrders(userId)`
- Card links to `/profile/orders/:orderId`
- Detail page shows full timeline, line items, shipping address

### Security

- Password change form and active sessions list — **UI only**, no API calls
- Placeholder until auth backend supports password management

## useCurrentProfile

```js
const { user, profile } = useCurrentProfile()
// user from useAuthStore, profile from useProfileStore.byUserId[user.id]
```

Used across profile pages, checkout, header actions, and location dialog (saved addresses).

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `createSeedProfile()` on login | `GET /users/me` |
| `updateProfile` / address CRUD in Zustand | `PATCH /users/me`, `/users/addresses` REST |
| Overview stats from `mockOrders` | `useOrders()` query |
| Security page UI-only | `POST /auth/change-password`, session management API |
| Avatar upload placeholder | `POST /users/avatar` or CDN upload |

**Stable contracts:**

- Route structure `/profile/*`
- `UserProfile` and `ProfileAddress` field set
- Sidebar nav items and layout pattern
- Address sharing with checkout flow

**Likely to change:**

- Overview pulling from static `mockOrders` instead of orders store
- Security screen (may add 2FA, device management)
- Profile completeness calculation rules

## Related

- [06-auth.md](./06-auth.md)
- [10-checkout.md](./10-checkout.md)
- [11-orders-tracking.md](./11-orders-tracking.md)
- [13-location-pincode.md](./13-location-pincode.md)
