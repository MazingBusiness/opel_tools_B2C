# Dependencies

## Overview

B2C (`opel-tools-b2c`) installs packages that are **actually used** in the B2B reference app (`ref/`), plus B2C-only additions. Unused B2B packages and CSS frameworks were skipped.

## Installed (from B2B `ref` usage)

| Package | Role |
| --- | --- |
| `axios` | HTTP / API helpers |
| `react-router-dom` | Routing, layouts, links |
| `react-icons` | UI icons |
| `react-slick` | Carousels / sliders |
| `slick-carousel` | Styles/peer for `react-slick` |
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

## Skipped from B2B `package.json`

| Package | Reason |
| --- | --- |
| `react-notifications` | Only commented-out imports in `ref` |
| `react-toastify` | Not imported; B2B already uses `react-hot-toast` |
| `gh-pages` | Deploy tooling for the B2B demo host |
| `eslint` / related | B2C uses oxlint instead |

## CSS: plain CSS (no framework)

B2B styling is custom plain CSS:

- `ref/src/styles/global.css`
- `ref/src/styles/mainStyle.css`
- `ref/src/styles/responsive.css`

**No Tailwind, Bootstrap, or MUI** was installed. Frameworks fight the existing B2B class names and make matching look-and-feel harder. Port/adapt those stylesheets into B2C when UI work starts.

## Install command used

```bash
npm install axios zustand @tanstack/react-query react-router-dom react-icons react-slick slick-carousel react-hot-toast sweetalert2 react-responsive-carousel react-calendar recharts
```

## Notes

- App wiring (router shell, Zustand stores, React Query `QueryClientProvider`, style port) is a separate step.
- Use **Zustand** for client/UI state and **TanStack React Query** for server/async data — do not duplicate remote cache in Zustand.
- Core stack remains Vite + React (see [01-project-initialisation.md](./01-project-initialisation.md)).
