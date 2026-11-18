# TremTec

TremTec is a strategic engineering consulting and outsourcing platform that helps high-growth companies accelerate their development process and scale high-performance technical teams.

## Mission

> **"Build trustworthy software faster. We help your team master AI—not replace humans with it—and create SDLCs that actually sustain."**

See [docs/mission_and_values.md](docs/mission_and_values.md) for the full mission, values and positioning.

## Core Services

1. **Implementation**: reproducible SDLCs that combine AI and human expertise.
2. **Diagnostics**: deep analysis of where your team is actually slow, with a clear roadmap.
3. **Mentoring**: ongoing coaching to work symbiotically with AI and modern tools.

## Tech Stack

- **Web**: Astro 7 (SSR on Cloudflare Workers), htmx, Tailwind CSS 4 + DaisyUI
- **API**: Hono + Zod, mounted at `/api` (`src/pages/api/[...path].ts`)
- **Auth**: GitHub and Google OAuth, session cookie
- **Infrastructure**: Pulumi + Cloudflare (`infra/`)
- **Tooling**: Bun, Biome, Vitest, lefthook, mise

## Project Structure

```
src/
├── domain/      # Entities (Zod schemas) and services, tests co-located
│   ├── auth/
│   ├── contact/
│   ├── user/
│   └── shared/
├── server/      # Hono routes (auth, contact, health)
├── pages/       # Astro routes, blog and RSS
├── content/     # Blog posts and products (content collections)
├── ui/          # Astro components, styles, assets
├── lib/         # API client, errors, helpers
├── middleware.ts
└── config.ts    # Environment validation
infra/           # Pulumi program
docs/            # Mission & values, board meeting notes
.github/         # CI/CD workflows
roadmap.md
```

## Getting Started

Requires Node.js 22.23.4+ and [Bun](https://bun.sh). [mise](https://mise.jdx.dev) installs Bun, Wrangler and Pulumi, and loads `.env`.

```bash
mise install
bun install

# .env is stored encrypted in the repo
mise decrypt

bun run dev
```

### Commands

```bash
bun run dev        # Astro dev server
bun run build      # Production build
bun run lint       # Biome + astro check
bun run fix        # Biome auto-fix
bun run test       # Vitest
bun w dev          # Run the built Worker locally (wrangler), after bun run build
```

### Environment Variables

Validated in `src/config.ts`:

- `BASE_URL`: public application URL
- `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth app
- `GOOGLE_ID`, `GOOGLE_SECRET`: Google OAuth client

Deployed Workers get them from Pulumi: `BASE_URL` from the stack's domain, the OAuth values from the stack's encrypted config (`infra/Pulumi.<stack>.yaml`).

## CI/CD

GitHub Actions runs four workflows from `.github/workflows/`:

- **Quality Gateway** (`quality-gateway.yml`): lint, tests and build on pull requests to `main` and on pushes to `main`.
- **CodeQL** (`codeql.yml`): code scanning for JavaScript and TypeScript on pull requests to `main`, on pushes to `main` and weekly.
- **Deploy** (`deploy.yml`): a push to `main` deploys the `dev` stack.
- **Release** (`release.yml`): a tag `X.Y.Z` deploys the `production` stack and creates a GitHub release.

The required checks for pull requests to `main` are `Lint`, `Test`, `Build` and `Analyze (javascript-typescript)`. Deploy and Release don't wait for Quality Gateway, so a push to `main` deploys `dev` even if lint or tests fail.

## Deployment

Infrastructure is managed with Pulumi (`infra/`), one stack per environment. Deploys normally run in GitHub Actions:

- A push to `main` runs [`deploy.yml`](.github/workflows/deploy.yml), which builds the app and deploys the `dev` stack (`dev.tremtec.com`).
- Pushing a tag `X.Y.Z` where each part is a number, like `1.2.3`, runs [`release.yml`](.github/workflows/release.yml), which builds and deploys the `production` stack (`tremtec.com`) and then creates a GitHub release with generated notes. Other tags, such as `v1.2.3`, `1.2.3-rc` or `1.2.3.4`, are ignored.

```bash
git tag 1.2.3 && git push origin 1.2.3
```

Both workflows read these secrets from the `cloudflare` GitHub environment (Settings > Environments):

- `PULUMI_BACKEND_URL`: S3-compatible state bucket URL used by `infra/Pulumi.yaml`.
- `PULUMI_CONFIG_PASSPHRASE`: decrypts the stack secrets.
- `CLOUDFLARE_API_TOKEN`: lets the Pulumi Cloudflare provider manage the Worker, custom domains and redirect rules.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: access keys for the state bucket.

### Manual deploy

As a fallback, deploy from your machine with the same variables set (mise loads `.env`; the workflows also set `AWS_REGION=auto`). Build first, because `infra/index.ts` uploads the build output from `dist/`:

```bash
bun run build
cd infra && pulumi up --stack production # or --stack dev
```

## Contributing

See [AGENTS.md](AGENTS.md) for architecture and code conventions. Lefthook formats staged files on commit and runs lint and tests on push.

## License

MIT, see [LICENSE](LICENSE).
