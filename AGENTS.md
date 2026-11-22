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

Layered architecture, cut vertically per feature (`src/domain/<feature>/`):

- **Presentation** (`src/pages/`, `src/ui/`, `src/server/`): Astro pages and components, Hono routes. Only talk to services, never to the database. Pages and routes get services from `Astro.locals.services` / `c.var.services`, which the middleware provides (`src/server/services.ts` is the composition root).
- **Services** (`src/domain/*/service.ts`): business rules and orchestration of repositories. Built with `createXService(repo)`, no knowledge of storage. Tested with stub repositories.
- **Repositories** (`src/domain/*/repository.ts`): data access only, query creation and row mapping (D1). Built with `createXRepository(db)`. Tested against real SQL via `src/lib/testing/d1.ts` (`node:sqlite`).
- **Domain** (`src/domain/*/schema.ts`): entities as Zod schemas, no framework dependencies. Export both the schema and the inferred type.
- **Infra** (`infra/`): Pulumi program for the Cloudflare Worker, D1 database and migrations, domain and redirects.

UI is Tailwind + DaisyUI with htmx for interactivity. Keep pages thin: compose them from components in `src/ui/components/` and put the specifics in the components. Call the API through `src/lib/api-client.ts`.

Auth uses GitHub and Google OAuth. The session cookie holds only a signed `{uid, exp}` (HMAC, `signSession`/`verifySession`); the user is loaded from D1 on each private request, so role and status changes apply immediately. Verified `@tremtec.com` emails become active admins on first sign in, everyone else starts `pending`. Admin-only routes: `/dashboard/users` (middleware) and `/api/users` (Hono).

Users live in D1 (`DB` binding, schema in `migrations/`). Environment is validated in `src/config.ts`.

The CSP is on: no inline `style=` or `on*=` attributes in UI code. Use classes and htmx attributes.

## Conventions

- TypeScript strict, no `any`.
- Files in kebab-case, types and components in PascalCase, functions and variables in camelCase.
- Absolute imports via the `~/` alias (maps to `src/`).
- Biome formats and lints (double quotes, 100 columns); lefthook runs it on commit.
- Tests use the `.test.ts` suffix, next to the source.

## Adding a Feature

1. Create `src/domain/<feature>/` with `schema.ts`, `repository.ts` and `service.ts`.
2. Register the service in `src/server/services.ts` and add routes in `src/server/`.
3. Add UI in `src/ui/` and pages in `src/pages/`.
4. Add repository and service tests, then run lint and tests.

## Notes

- `astro check` does not support TypeScript 7 yet, so `typescript` stays on 6.x.
- Pulumi packages are intentionally not upgraded with the rest (known to break).
- Blog posts live in `src/content/`.
- Pull requests to `main` need the `Lint`, `Test` and `Build` checks (`.github/workflows/quality-gateway.yml`) and `Analyze (javascript-typescript)` (`.github/workflows/codeql.yml`).
- Pushing to `main` deploys the `dev` stack via `.github/workflows/deploy.yml`, and pushing a tag `X.Y.Z` (numbers only, so not `v1.2.3` or `1.2.3-rc`) deploys production via `.github/workflows/release.yml`. README "Deployment" lists the required secrets and the manual fallback.
