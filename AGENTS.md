# AGENTS.md

## Monorepo layout

Two independent packages (`backend/`, `frontend/`), each with own `package.json`, configs, and `node_modules`. No workspace protocol.

## Backend (`backend/`)

- **Run**: `npm run dev` (tsx watch), `npm test` (vitest), `npm run build` (tsc). Also `test:ui` / `test:coverage`.
- **DB**: Drizzle ORM + postgres-js driver → `DATABASE_URL` in `.env`. `dotenv/config` loaded as side-effect in `src/core/db.ts` (no explicit config call needed).
  - `npm run db:generate` / `db:push` / `db:studio`
  - Schema entrypoint: `src/core/db.ts` — re-exports all module schemas. Add new module schemas here.
- **Module pattern**: `{module}.routes.ts` → `{module}.controller.ts` → `{module}.service.ts` + `{module}.schema.ts`. Exception: `tasks/` also has `tasks.dashboard.service.ts`.
- **Routes**: Mounted under `/api` in `src/index.ts`. Central `src/routes/router.ts` wires all module routers.
- **Auth**: JWT via `requireAuth` middleware (`src/middlewares/authMiddleware.ts`), sets `req.user.id` from the `userId` claim.
- **Validation**: Zod per module, applied via `validate()` middleware. Schema expects `body`/`query`/`params` keys.
- **Error handling**: `HttpException` / `NotFoundException` in `src/core/errorHandler.ts`. `errorMiddleware` catches them. Controllers wrap calls in try/catch → `next(error)`.
- **CORS**: Allows `FRONTEND_URL` env var and `http://localhost:5173` with credentials.
- **Tests**: Vitest with `globals: true`. Vitest config (`vitest.config.ts`) includes `src/**/*.spec.ts`, `src/**/*.test.ts`, `tests/**/*.spec.ts`. Mock `db` directly (see `tests/*.spec.ts`). Run with `npm test`.
- **Response format**: Controllers return `{ status: "success", data: ... }`.

## Frontend (`frontend/`)

- **Run**: `npm run dev` (vite, port 5173), `npm run type-check` (vue-tsc), `npm run build` (type-check + vite build)
- **Required order**: `lint -> type-check` (build chains type-check + build-only)
- **Lint**: `npm run lint` → oxlint (fix) then eslint (fix --cache). Format: `npm run format` (prettier, writes in-place).
- **Entry**: `src/main.ts` — creates Vue app, Pinia (+ persistedstate plugin), router.
- **Path alias**: `@/` → `src/`.
- **Auth**: Token in localStorage as `@TaskFy:token`. Axios interceptor (`src/services/api.ts`) sets `Authorization: Bearer` header.
- **Pinia stores**: `auth` and `task` stores use `pinia-plugin-persistedstate` (`persist: true`). `theme` store manages `@TaskFy:theme` manually in localStorage.
- **Router**: `src/router/index.ts`. Auth guard via `beforeEach` — redirects to `/login` if `requiresAuth` met but no token, redirects to `Dashboard` if `requiresGuest` met but token present.
- **Styling**: Tailwind with custom theme in `tailwind.config.js` (colors, fonts, shadows). `darkMode: 'class'`.
- **API base**: `VITE_API_URL=http://localhost:3000/api` in `.env`.
- **Component convention**: Feature modules in `src/modules/` (auth, dashboard, notifications, projects, tasks, teams, workloads), services in `src/services/`, stores in `src/stores/`.

## Gotchas

- Backend uses `.js` extensions in imports (ESM with `"type": "module"`). Always import with `.js` suffix.
- `vi.mock("../src/core/db", ...)` — most tests omit `.js` in the mock path (Vitest handles resolution). If it fails, try adding `.js`.
- Frontend ESLint uses flat config (`eslint.config.ts`). Oxlint active via `eslint-plugin-oxlint` with `.oxlintrc.json`.
- `frontend/.editorconfig`: 2-space indent, LF, final newline, no trailing whitespace, 100 max width.
- Frontend Prettier: no semicolons, single quotes, printWidth 100.
- Backend engine: Node >=22.12 (from frontend `package.json` `engines` field — use a recent Node).
