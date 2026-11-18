# TremTec

Strategic engineering consulting platform: Astro (SSR on Cloudflare Workers) with a Hono API. See [README.md](README.md) for overview and setup, and [roadmap.md](roadmap.md) for planned work.

## Commands

```bash
bun run dev       # dev server
bun run build     # production build
bun run lint      # Biome + astro check
bun run fix       # Biome auto-fix
bun run test      # Vitest
bun run db:migrate && bun run db:seed   # local D1 schema and sample users
bun w dev         # Worker locally (wrangler)
```

Run `bun run lint` and `bun run test` before committing.

## Architecture

Simplified layered architecture:

- **Domain** (`src/domain/*/schema.ts`): entities as Zod schemas, no framework dependencies. Export both the schema and the inferred type.
- **Services** (`src/domain/*/service.ts`): stateless use cases with injected dependencies. Tests are co-located (`service.test.ts`).
- **Server** (`src/server/`): Hono routes, validation (`@hono/zod-validator`), OAuth. Delegates to services, holds no business logic. Mounted via `src/pages/api/[...path].ts`.
- **UI** (`src/ui/`, `src/pages/`): Astro components and pages, Tailwind + DaisyUI, htmx for interactivity. Call the API through `src/lib/api-client.ts`.
- **Infra** (`infra/`): Pulumi program for the Cloudflare Worker, domain and redirects.

Auth uses GitHub and Google OAuth. The session cookie holds only a signed `{uid, exp}` (HMAC, `signSession`/`verifySession`); the user is loaded from D1 on each private request, so role and status changes apply immediately. Verified `@tremtec.com` emails become active admins on first sign in, everyone else starts `pending`. Admin-only routes: `/dashboard/users` (middleware) and `/api/users` (Hono).

Users live in D1 (`DB` binding, schema in `migrations/`). Services take the `D1Database` as an argument; tests run them on `node:sqlite` via `src/lib/testing/d1.ts`. Environment is validated in `src/config.ts`.

The CSP is on: no inline `style=` or `on*=` attributes in UI code. Use classes and htmx attributes.

## Conventions

- TypeScript strict, no `any`.
- Files in kebab-case, types and components in PascalCase, functions and variables in camelCase.
- Absolute imports via the `~/` alias (maps to `src/`).
- Biome formats and lints (double quotes, 100 columns); lefthook runs it on commit.
- Tests use the `.test.ts` suffix, next to the source.

## Adding a Feature

1. Create `src/domain/<feature>/` with `schema.ts` and `service.ts`.
2. Add routes in `src/server/`.
3. Add UI in `src/ui/` and pages in `src/pages/`.
4. Add service tests, then run lint and tests.

## Notes

- `astro check` does not support TypeScript 7 yet, so `typescript` stays on 6.x.
- Pulumi packages are intentionally not upgraded with the rest (known to break).
- Blog posts and products live in `src/content/`.
- Pull requests to `main` need the `Lint`, `Test` and `Build` checks (`.github/workflows/quality-gateway.yml`) and `Analyze (javascript-typescript)` (`.github/workflows/codeql.yml`).
- Pushing to `main` deploys the `dev` stack via `.github/workflows/deploy.yml`, and pushing a tag `X.Y.Z` (numbers only, so not `v1.2.3` or `1.2.3-rc`) deploys production via `.github/workflows/release.yml`. README "Deployment" lists the required secrets and the manual fallback.
