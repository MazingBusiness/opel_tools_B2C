# Folder Structure

## Overview

B2C uses a **feature-based** layout under `src/`. B2B (`ref/`) informs domain/API shape and page inventory; **UI is built from scratch** (new marketplace screenshots), not by porting B2B CSS.

Language is **JavaScript (JSX)**. Client state lives in **`app/store/`** (Zustand). Server/async state uses **TanStack React Query** (`app/query/` + per-feature hooks). Styling uses **Tailwind CSS v4**.

## Tree

```
.env.example
src/
  app/
    components/          # App-shell UI
    layout/              # MainLayout, Header (TopBar, MainBar, CategoryNav + mega menu), Footer
    notifications/       # Toast / alert wiring
    query/               # QueryClient + QueryProvider
    store/               # Zustand stores
    router/              # Routes + private route guards
    theme/               # palette.js reference (tokens live in styles/theme.css)
    App.jsx              # Root: providers + router
  assets/                # Icons, images
  features/
    auth/
      api/               # api.js, endpoints.js, hooks.js, types.js
      components/
      pages/
    cart/
    home/
      components/        # HeroSlider, CategorySection, BannerSection, …
      data/              # heroSlides, categorySections, bannerSections (dummy → API later)
      pages/             # HomePage
    order/
    products/
    user/
    types.js
  shared/
    api/                 # Shared axios client / request helpers
    components/          # Cross-feature UI (e.g. ProductCard)
    utils/               # e.g. formatPrice
  styles/                # theme.css (@theme tokens) + rare overrides
  types/                 # Shared JSDoc typedefs if needed
  index.css              # Tailwind entry; imports styles/theme.css
  main.jsx
```

## Conventions

- **Feature owns its UI + API hooks.** Put page and feature-specific components under `features/<name>/`. Use `shared/` only for truly cross-cutting code (e.g. [`ProductCard`](../src/shared/components/ProductCard.jsx)).
- **Zustand** (`app/store`) = client / UI state (auth session flags, cart UI, drawers).
- **React Query** (`app/query` + `features/*/api/hooks.js`) = server / async data (fetch, cache, refetch).
- **Do not** duplicate remote API cache in Zustand.
- **Tailwind first** for layout, spacing, and responsive UI. **OPEL brand colors** live in `src/styles/theme.css` (`@theme`: Pantone 7712 teal, black, Pantone 7752 gold). JS reference: `app/theme/palette.js`. Keep other files under `src/styles/` for third-party or one-off overrides only — do not port `ref/src/styles/*`.
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
| `styles/*` (plain CSS) | **Not ported** — B2C uses Tailwind (`index.css` + utilities) |
| `assets/*` | `assets/` |
| Ad-hoc `localStorage` | `app/store/` |
| Ad-hoc fetch + local state | `app/query/` + feature `hooks.js` |

## Entry wiring

1. [`src/main.jsx`](../src/main.jsx) mounts the app and imports [`src/app/App.jsx`](../src/app/App.jsx).
2. `App` wraps the tree in `QueryProvider` + `BrowserRouter`, then renders `AppRoutes`.
3. Public pages nest under [`MainLayout`](../src/app/layout/MainLayout.jsx) (`Header` + `<Outlet />` + `Footer` + auth modal). Header stack: promo `TopBar` + `MainBar` + `CategoryNav` (hover/tap mega menu with static OPEL tool categories in `categoryNavData.js`). Logo at [`src/assets/images/opelLogo.jpg`](../src/assets/images/opelLogo.jpg). Footer is marketplace-inspired (trust strip, link columns, contact/social, legal) with OPEL copy and brand accents — not a port of B2B/Moglix markup.
4. Auth: header “Login Now” opens [`AuthModal`](../src/features/auth/components/AuthModal.jsx) (phone/email → OTP, or Google). Session lives in [`useAuthStore`](../src/app/store/useAuthStore.js) (persisted); modal open state in [`useUiStore`](../src/app/store/useUiStore.js). `/login` redirects home and opens the modal. Mock OTP `123456` until API is wired.
5. Homepage composition (hero, category bands, static banner strips, shared product card): [04-homepage.md](./04-homepage.md).
6. API base URL comes from `VITE_API_BASE_URL` (see [`.env.example`](../.env.example)). Copy to `.env` for local use.

## Related

- [01-project-initialisation.md](./01-project-initialisation.md)
- [02-dependencies.md](./02-dependencies.md)
- [04-homepage.md](./04-homepage.md)
