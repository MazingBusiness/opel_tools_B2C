# Location & Pincode

## Overview

Delivery location is selected via a global dialog opened from the header location button in [`MainBar`](../src/app/layout/MainBar.jsx). There is no dedicated route — the dialog is rendered in [`MainLayout`](../src/app/layout/MainLayout.jsx) alongside other overlays.

Users can check a pincode or pick a saved address (when logged in). The selected location persists and displays in the header.

## Key files

| Path | Role |
| --- | --- |
| [`features/location/components/LocationDialog.jsx`](../src/features/location/components/LocationDialog.jsx) | Pincode check + saved address picker |
| [`features/location/data/serviceablePincodes.js`](../src/features/location/data/serviceablePincodes.js) | Demo pincode lookup table |
| [`app/store/useLocationStore.js`](../src/app/store/useLocationStore.js) | Persisted delivery location |
| [`app/store/useUiStore.js`](../src/app/store/useUiStore.js) | Dialog open/close |
| [`app/layout/MainBar.jsx`](../src/app/layout/MainBar.jsx) | Location button + display |

## Location shape

```js
/** DeliveryLocation — stored in useLocationStore */
{
  pincode: string,
  city: string,
  state: string,
  label?: string,       // 'Home' | 'Work' when from saved address
  addressId?: string,   // links to ProfileAddress.id
}
```

Persisted to `localStorage` key `opel-delivery-location`.

## Dialog flow

```
Open dialog (header pin button)
├── Enter pincode → Check → preview city/state
│   └── "Deliver here" → setLocation + close
└── (if logged in) Saved addresses list
    └── Tap address → setLocation from profile address + close
```

[`lookupPincode()`](../src/features/location/data/serviceablePincodes.js) validates against a static allowlist. Unknown pincodes return an error message.

When logged out, a hint prompts sign-in to use saved addresses.

## Header display

[`MainBar`](../src/app/layout/MainBar.jsx) reads `useLocationStore`:

| State | Primary line | Secondary line |
| --- | --- | --- |
| Location set | `{city} {pincode}` | "Change location >" |
| Not set | "Location not set" | "Select delivery location >" |

## Relationship to profile addresses

Location dialog reads addresses from `useCurrentProfile().profile.addresses`. Selecting an address copies `pincode`, `city`, `state`, and stores `addressId` for highlight sync.

Checkout uses profile addresses separately ([`AddressStep`](../src/features/checkout/components/AddressStep.jsx)) — delivery location in header is for **browse-time serviceability display**, not checkout address selection.

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| `serviceablePincodes.js` static map | `GET /delivery/check?pincode=` API |
| Client-side validation only | Server-side serviceability + ETA |
| No link to cart shipping calc | Pincode drives shipping options and availability badges |
| Location independent of checkout address | Optional sync: header location pre-selects checkout address |

**Stable contracts:**

- `DeliveryLocation` field set
- Dialog UX (pincode check + saved address picker)
- Header display pattern
- `useLocationStore` / `setLocation` API

**Likely to change:**

- Static pincode allowlist (replace with live API)
- Serviceability message copy
- Whether location affects product availability display on PLP/PDP

## Related

- [05-layout-navigation.md](./05-layout-navigation.md)
- [12-profile-account.md](./12-profile-account.md)
- [10-checkout.md](./10-checkout.md)
