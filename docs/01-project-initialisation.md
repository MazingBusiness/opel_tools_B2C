# Project Initialisation

## Overview

`opel-tools-b2c` is a Vite + React app scaffolded in the repository root. Demo boilerplate was removed so the app starts as an empty shell.

## Stack

| Piece | Version / notes |
| --- | --- |
| Vite | `^8.2.0` |
| React | `^19.2.8` |
| React DOM | `^19.2.8` |
| `@vitejs/plugin-react` | `^6.0.4` |
| Linter | oxlint (`^1.75.0`) |
| Language | JavaScript (JSX) |
| Module type | ESM (`"type": "module"`) |

## Prerequisites

- Node.js (LTS recommended; Vite 8 requires a current Node version)
- npm (ships with Node)

## Setup

```bash
npm install
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## Project structure

Feature-based layout under `src/` (see [03-folder-structure.md](./03-folder-structure.md) for the full tree and conventions).

```
.
├── docs/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/              # App shell: providers, router, store, layout
│   ├── assets/
│   ├── features/         # Domain features (auth, cart, home, …)
│   ├── shared/           # Cross-feature api / components / utils
│   ├── styles/
│   ├── types/
│   ├── index.css
│   └── main.jsx          # App entry
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── .oxlintrc.json
```

## What was initialised

1. Scaffolded with `npm create vite@latest . -- --template react`
2. Installed dependencies with `npm install`
3. Removed Vite starter assets and demo UI:
   - `src/assets/` (logos / hero image)
   - `src/App.css`
   - `public/icons.svg`
   - starter `README.md`
4. Left `App` as a minimal empty component and `index.css` as a basic reset

## Required info to run locally

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Open the URL printed in the terminal (default `http://localhost:5173`)

Optional env (see `.env.example`): copy to `.env` and set `VITE_API_BASE_URL` when wiring the API.
