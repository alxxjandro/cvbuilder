# CV Builder

A web app to build ATS-friendly CVs. You edit your CV through a sectioned
sidebar and see a live, print-ready preview.

## Stack

- **React 19 + Vite** with **TypeScript** (strict).
- **Zustand** for global CV state (`src/state/cvStore.ts`).
- **Vitest + React Testing Library** for tests.
- **ESLint + Prettier** for linting and formatting.

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the Vite dev server.           |
| `npm run build`      | Type-check and build for production. |
| `npm run preview`    | Preview the production build.        |
| `npm test`           | Run the test suite once.             |
| `npm run test:watch` | Run tests in watch mode.             |
| `npm run typecheck`  | Type-check without emitting.         |
| `npm run lint`       | Lint the project.                    |
| `npm run prettier`   | Format the project.                  |

## Architecture

The CV document is a single typed object (`CVData` in `src/types/cv.ts`) that
every layer shares as the source of truth.

- **`src/types/cv.ts`** — the data model. Every list entry has a stable `id`.
- **`src/model/cv.ts`** — factories (`createEmptyCV`, `createEntry`, ...) and
  the `SAMPLE_CV` seed.
- **`src/state/cvStore.ts`** — the Zustand store: holds `data` and all the
  immutable mutation actions. Components subscribe to slices via selectors.
- **`src/utils/formatDate.ts`** — date formatting helpers.
- **`src/components/`** — the editor (`Sidebar` + `sections/`) and the live
  preview (`CV`). Sections read state and call actions directly from the store.

## Roadmap

1. **Foundations** (done) — TypeScript, typed model, Zustand store, tests.
2. **Local persistence + multi-CV** — routing, localStorage, a "My CVs"
   dashboard.
3. **Auth + cloud** — Supabase (Google OAuth, Postgres).
4. **ATS export** — real-text PDF (`@react-pdf/renderer`) and `.docx`.
5. **UI redesign**.
6. **AI coach** — improvement suggestions.
