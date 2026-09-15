# Authentication

## Overview

Auth is modal-based — no dedicated login page UI. Users sign in via [`AuthModal`](../src/features/auth/components/AuthModal.jsx) from the header, a protected route, or `/login` (which redirects home and opens the modal).

Flow:

```
Identifier step (phone or email)
  → OTP step (demo code: 123456)
  → Session saved in useAuthStore + profile seeded

Alternative: Google demo button → instant session
```

Protected routes (`/checkout`, `/profile/*`) use [`RequireAuth`](../src/app/router/RequireAuth.jsx). When logged out, the guard shows a placeholder and opens the auth modal while preserving the intended URL.

## Key files

| Path | Role |
| --- | --- |
| [`features/auth/components/AuthModal.jsx`](../src/features/auth/components/AuthModal.jsx) | Modal shell + step orchestration |
| [`features/auth/components/AuthIdentifierStep.jsx`](../src/features/auth/components/AuthIdentifierStep.jsx) | Phone/email input + Google button |
| [`features/auth/components/AuthOtpStep.jsx`](../src/features/auth/components/AuthOtpStep.jsx) | 6-digit OTP input |
| [`features/auth/pages/LoginPage.jsx`](../src/features/auth/pages/LoginPage.jsx) | Redirects `/` + opens modal |
| [`features/auth/utils/identifier.js`](../src/features/auth/utils/identifier.js) | Identifier parsing + `DEMO_OTP` |
| [`app/router/RequireAuth.jsx`](../src/app/router/RequireAuth.jsx) | Route guard for checkout + profile |
| [`app/store/useAuthStore.js`](../src/app/store/useAuthStore.js) | Persisted session |
| [`app/store/useUiStore.js`](../src/app/store/useUiStore.js) | Modal open/close |
| [`app/store/useProfileStore.js`](../src/app/store/useProfileStore.js) | Profile seeded on login |
| [`features/auth/api/`](../src/features/auth/api/) | Stub API layer (endpoints empty) |

## Session shape

```js
/** AuthUser — stored in useAuthStore */
{
  id: string,           // e.g. 'otp-9876543210' or 'google-demo'
  identifier: string,   // normalized phone or email
  method: 'otp' | 'google',
}
```

`useAuthStore` persists to `localStorage` key `opel-auth`. On successful login, `ensureProfile(user)` creates a seed profile in `useProfileStore` if one does not exist.

## Identifier validation

[`parseIdentifier()`](../src/features/auth/utils/identifier.js):

- Email: must match basic `EMAIL_RE`
- Phone: 10–15 digits after stripping spaces/dashes/parens
- Returns `{ ok, identifier, kind }` or `{ ok: false, error }`

Demo OTP: **`123456`** (`DEMO_OTP` constant). No SMS/email is sent — a toast confirms "OTP sent".

## RequireAuth guard

When `user` is null:

1. `useEffect` calls `openAuthModal()`
2. Renders a sign-in placeholder (not a redirect)
3. After login, the same URL renders the protected `<Outlet />`

This keeps deep links like `/checkout` or `/profile/orders` intact.

## Stub API layer

[`features/auth/api/`](../src/features/auth/api/) has placeholder files ready for backend wiring:

| File | Purpose |
| --- | --- |
| `endpoints.js` | Route paths (currently empty export) |
| `api.js` | Request functions |
| `hooks.js` | React Query hooks |
| `types.js` | JSDoc type placeholders |

When APIs land, move OTP send/verify and Google OAuth into `hooks.js`; keep `useAuthStore` for the session token/user only.

## Dummy data & API migration

| Current (mock) | Replace with |
| --- | --- |
| Client-side OTP check against `DEMO_OTP` | `POST /auth/otp/send` + `POST /auth/otp/verify` |
| Google button creates fake user | Google OAuth redirect / token exchange |
| `login(user)` sets arbitrary `id` | JWT/session from API response |
| Profile seeded locally on login | `GET /users/me` via React Query |

**Stable contracts:**

- `AuthUser` fields (`id`, `identifier`, `method`) — align with API user DTO
- Modal two-step flow (identifier → OTP) — UX likely stays
- `RequireAuth` guard pattern — swap store check for token validity
- `/login` → home + open modal behavior

**Likely to change:**

- Demo OTP constant and toast-only "send OTP"
- User `id` format (`otp-{identifier}` vs server UUID)

## Related

- [05-layout-navigation.md](./05-layout-navigation.md)
- [10-checkout.md](./10-checkout.md)
- [12-profile-account.md](./12-profile-account.md)
