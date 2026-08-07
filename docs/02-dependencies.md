# Dependencies

## Overview

B2C (`opel-tools-b2c`) is built **from scratch**. B2B (`ref/`) is reference for domain/API behavior and page inventory only — not for styling or layout.

Packages fall into three buckets:

1. **From B2B usage** — libraries the reference app actually imports (UI carousels, toasts, etc.)
2. **B2C-only** — state, data-fetching, and styling choices for the new marketplace UI
3. **Skipped** — unused or replaced B2B packages

## Installed (from B2B `ref` usage)

| Package | Role |
| --- | --- |
| `axios` | HTTP / API helpers |
| `react-router-dom` | Routing, layouts, links |
| `react-icons` | UI icons |
| `react-hot-toast` | Toast notifications |
| `sweetalert2` | Confirm / alert dialogs |
| `react-responsive-carousel` | Product gallery carousels |
| `react-calendar` | Profile dashboard calendar |
| `recharts` | Profile dashboard charts |

## Installed (B2C-only)

| Package | Why |
| --- | --- |
| `zustand` | Global state (auth, cart, UI). B2B used scattered `localStorage`; Zustand is the B2C approach going forward. |
| `@tanstack/react-query` | Server/async state (API fetching, caching, refetch). B2B used ad-hoc axios + local state; React Query is the B2C approach for remote data. |
| `tailwindcss` + `@tailwindcss/vite` | Utility-first CSS for the new B2C marketplace UI (dense header, category bar, hero/promo grids, product carousels) with first-class responsive breakpoints. |
| `embla-carousel-react` + `embla-carousel-autoplay` | Headless hero/product carousels — Tailwind-friendly, no legacy slick CSS. Replaces B2B `react-slick` in B2C. |

## Skipped from B2B `package.json`

| Package | Reason |
| --- | --- |
| `react-notifications` | Only commented-out imports in `ref` |
| `react-toastify` | Not imported; B2B already uses `react-hot-toast` |
| `react-slick` / `slick-carousel` | B2B carousels; B2C uses Embla instead |
| `gh-pages` | Deploy tooling for the B2B demo host |
| `eslint` / related | B2C uses oxlint instead |

## CSS: Tailwind CSS v4 (B2C from scratch)

B2C does **not** port B2B plain CSS (`ref/src/styles/*`). Those sheets are tightly coupled to B2B class names and a different visual system.

**Choice: Tailwind CSS v4** via the official Vite plugin — best fit for:

- Custom marketplace layouts (multi-row header, icon category strip, hero + promo grids, product cards)
- Responsive behavior (horizontal scroll on mobile, stacked promo grids, fluid product carousels)
- Building UI from new design screenshots without fighting legacy B2B CSS

**Not chosen:** Bootstrap / MUI — heavier opinionated components that fight a custom marketplace look; harder to match screenshot density and branding.

### Setup

```bash
npm install -D tailwindcss @tailwindcss/vite
```

- Plugin registered in [`vite.config.js`](../vite.config.js)
- Entry styles in [`src/index.css`](../src/index.css): `@import "tailwindcss"` + OPEL `@theme` from [`src/styles/theme.css`](../src/styles/theme.css)
- Optional non-utility overrides: [`src/styles/overrides.css`](../src/styles/overrides.css)

### Brand tokens (`@theme`)

Source: OPEL product color palette guidelines (Pantone). Defined in [`src/styles/theme.css`](../src/styles/theme.css); JS reference in [`src/app/theme/palette.js`](../src/app/theme/palette.js).

| Token | Hex / role | Pantone / proportion |
| --- | --- | --- |
| `--color-brand` | `#00859B` — primary actions, links, active nav | Pantone **7712** · main body ~60–70% |
| `--color-brand-dark` / `--color-brand-light` | Hover / light header variants of teal | Derived from 7712 |
| `--color-secondary` | `#000000` — chrome, dense headers, secondary UI | Pantone **Black** · ~25–30% |
| `--color-highlight` / `--color-cta` | `#CCB34D` — CTAs, switches, focus accents | Pantone **7752** · highlights ~10–15% |
| `--color-ink` | Black body text | Secondary |
| `--color-surface` / `--color-surface-muted` | White / light grey page & card backgrounds | Marketplace readability (not print inks) |
| `--color-success` | Functional green for ratings / discount copy | Semantic only — not brand |

Use as Tailwind colors, e.g. `bg-brand`, `bg-highlight`, `text-secondary`, `bg-cta`.

## Install command used

```bash
npm install axios zustand @tanstack/react-query react-router-dom react-icons embla-carousel-react embla-carousel-autoplay react-hot-toast sweetalert2 react-responsive-carousel react-calendar recharts
npm install -D tailwindcss @tailwindcss/vite
```

## Notes

- App wiring (router shell, Zustand stores, React Query `QueryClientProvider`) is a separate step from UI build-out.
- Use **Zustand** for client/UI state and **TanStack React Query** for server/async data — do not duplicate remote cache in Zustand.
- Prefer Tailwind utilities for layout/spacing; keep `src/styles/` for rare third-party or one-off overrides only.
- Core stack remains Vite + React (see [01-project-initialisation.md](./01-project-initialisation.md)).
- Folder conventions: [03-folder-structure.md](./03-folder-structure.md).
- Homepage (category bands, banners, shared product card): [04-homepage.md](./04-homepage.md).
