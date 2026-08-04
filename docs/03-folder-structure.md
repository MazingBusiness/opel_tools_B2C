# Folder Structure

## Overview

B2C uses a **feature-based** layout under `src/`. The essence matches the B2B app (`ref/`), but folders are explicit and domain-owned instead of a flat `pages/` + `components/` dump.

Language is **JavaScript (JSX)**. Client state lives in **`app/store/`** (Zustand). Server/async state uses **TanStack React Query** (`app/query/` + per-feature hooks).

## Tree

```
.env.example
src/
  app/
    components/          # App-shell UI
    layout/              # Layout shells (header, footer, main)
    notifications/       # Toast / alert wiring
    query/               # QueryClient + QueryProvider
    store/               # Zustand stores
    router/              # Routes + private route guards
    theme/               # Theme tokens / CSS variables
    App.jsx              # Root: providers + router
  assets/                # Icons, images
  features/
    auth/
      api/               # api.js, endpoints.js, hooks.js, types.js
      components/
      pages/
    cart/
    home/
    order/
    products/
    user/
    types.js
  shared/
    api/                 # Shared axios client / request helpers
    components/          # Cross-feature UI
    utils/
  styles/                # Global / main / responsive CSS (ported later)
  types/                 # Shared JSDoc typedefs if needed
  index.css
  main.jsx
```

## Conventions

- **Feature owns its UI + API hooks.** Put page and feature-specific components under `features/<name>/`. Use `shared/` only for truly cross-cutting code.
- **Zustand** (`app/store`) = client / UI state (auth session flags, cart UI, drawers).
- **React Query** (`app/query` + `features/*/api/hooks.js`) = server / async data (fetch, cache, refetch).
- **Do not** duplicate remote API cache in Zustand.
- Prefer one feature folder per domain. Avoid B2B-style duplicate `_Component.jsx` copies.
- Extra B2B domains (warranty, quick-order, etc.) are added later as new `features/*` folders when needed.

## B2B (`ref/`) → B2C mapping

| B2B (`ref/src`) | B2C |
| --- | --- |
| `pages/*`, `pages/user-profile/*` | `features/*/pages/` |
| Feature-specific `components/*` | `features/*/components/` |
| `layouts/*` | `app/layout/` |
| `routes/*` | `app/router/` |
| `api/*`, `app_url.jsx` | `shared/api/` + `features/*/api/` |
| `utils/*` | `shared/utils/` |
| `styles/*` | `styles/` |
| `assets/*` | `assets/` |
| Ad-hoc `localStorage` | `app/store/` |
| Ad-hoc fetch + local state | `app/query/` + feature `hooks.js` |

## Entry wiring

1. [`src/main.jsx`](../src/main.jsx) mounts the app and imports [`src/app/App.jsx`](../src/app/App.jsx).
2. `App` wraps the tree in `QueryProvider`, then renders `AppRoutes`.
3. API base URL comes from `VITE_API_BASE_URL` (see [`.env.example`](../.env.example)). Copy to `.env` for local use.

## Related

- [01-project-initialisation.md](./01-project-initialisation.md)
- [02-dependencies.md](./02-dependencies.md)
