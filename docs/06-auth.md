# Authentication

## Overview

Auth is modal-based — no dedicated login page UI. Users sign in via [`AuthModal`](../src/features/auth/components/AuthModal.jsx) from the header, a protected route, or `/login` (which redirects home and opens the modal).

Flow (OTP — live):

```
Identifier step (phone or email)
  → POST /api/v1/auth/otp/request
  → OTP step
  → POST /api/v1/auth/otp/verify
  → Sanctum token + user saved in useAuthStore
  → Local profile seeded / patched from API user
```

Google button is deferred (toast only) until Firebase is wired. See backend doc `react-firebase-google-auth.md`.

Protected routes (`/checkout`, `/profile/*`) use [`RequireAuth`](../src/app/router/RequireAuth.jsx). When logged out, the guard shows a placeholder and opens the auth modal while preserving the intended URL.

## Key files

| Path | Role |
| --- | --- |
| [`features/auth/components/AuthModal.jsx`](../src/features/auth/components/AuthModal.jsx) | Modal shell + OTP orchestration |
| [`features/auth/components/AuthSessionBootstrap.jsx`](../src/features/auth/components/AuthSessionBootstrap.jsx) | Revalidate persisted token via `/me` |
| [`features/auth/components/AuthIdentifierStep.jsx`](../src/features/auth/components/AuthIdentifierStep.jsx) | Phone/email input + Google button |
| [`features/auth/components/AuthOtpStep.jsx`](../src/features/auth/components/AuthOtpStep.jsx) | 6-digit OTP input; Resend gated by `expires_in` countdown |
| [`features/auth/pages/LoginPage.jsx`](../src/features/auth/pages/LoginPage.jsx) | Redirects `/` + opens modal |
| [`features/auth/utils/identifier.js`](../src/features/auth/utils/identifier.js) | Identifier parsing |
| [`features/auth/api/`](../src/features/auth/api/) | Endpoints, axios calls, React Query hooks |
| [`shared/api/client.js`](../src/shared/api/client.js) | Shared axios client + Bearer + 401 handling |
| [`app/router/RequireAuth.jsx`](../src/app/router/RequireAuth.jsx) | Route guard for checkout + profile |
| [`app/store/useAuthStore.js`](../src/app/store/useAuthStore.js) | Persisted `token` + `user` |
| [`app/store/useUiStore.js`](../src/app/store/useUiStore.js) | Modal open/close |
| [`app/store/useProfileStore.js`](../src/app/store/useProfileStore.js) | Profile seeded on login |

## Env

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Copy from [`.env.example`](../.env.example). Paths in `AUTH_ENDPOINTS` are rooted at `/api/v1/auth/...`.

## Backend contract

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/v1/auth/otp/request` | `{ identifier }` → `{ ok, channel, expires_in }` — client disables Resend for `expires_in` seconds (typically 120 / 2 min) |
| POST | `/api/v1/auth/otp/verify` | `{ identifier, code }` → `{ token, user, profile_complete }` |
| GET | `/api/v1/auth/me` | Bearer |
| PATCH | `/api/v1/auth/profile` | Bearer |
| POST | `/api/v1/auth/logout` | Bearer |

Local OTP codes appear in Laravel `storage/logs/laravel.log` when mail/SMS env is empty.

## Session shape

```js
/** AuthUser — stored in useAuthStore (plus Sanctum token) */
{
  id: string,           // server user id
  identifier: string,   // email or phone
  method: 'otp' | 'google',
  name?: string,
  email?: string,
  phone?: string,
  avatar?: string,
}
```

`useAuthStore` persists `token`, `user`, and `profileComplete` to `localStorage` key `opel-auth`. On login, `ensureProfile(user)` seeds `useProfileStore` when needed. Redirect to `/profile/details` is **not always** — only when the verify (or `/me`) response has `profile_complete: false` (backend flag for incomplete name / contact fields).

## RequireAuth guard

When `user` is null:

1. `useEffect` calls `openAuthModal()`
2. Renders a sign-in placeholder (not a redirect)
3. After login, the same URL renders the protected `<Outlet />`

## Logout

Header and profile sidebar call `logoutRequest()` which `POST`s `/auth/logout` (best effort) then clears the local session. Axios also clears the session on HTTP 401.

## Related

- [05-layout-navigation.md](./05-layout-navigation.md)
- [10-checkout.md](./10-checkout.md)
- [12-profile-account.md](./12-profile-account.md)
