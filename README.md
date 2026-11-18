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
- **Auth**: GitHub and Google OAuth, session cookies (Cloudflare KV)
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
roadmap.md
```

## Getting Started

Requires Node.js 22.23+ and [Bun](https://bun.sh). [mise](https://mise.jdx.dev) installs the toolchain.

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
bun w dev          # Run the Worker locally (wrangler)
```

### Environment Variables

Validated in `src/config.ts`:

- `BASE_URL`: public application URL
- `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth app
- `GOOGLE_ID`, `GOOGLE_SECRET`: Google OAuth client

## Deployment

Infrastructure is managed with Pulumi and requires `PULUMI_CONFIG_PASSPHRASE` and a Cloudflare API token.

```bash
cd infra
bun run pulumi up --stack production
```

GitHub Actions deploys automatically:

- A push to `main` runs [`deploy.yml`](.github/workflows/deploy.yml), which builds the app and deploys the `dev` stack (`dev.tremtec.com`).
- Pushing a tag like `1.2.3` runs [`release.yml`](.github/workflows/release.yml), which deploys the `production` stack (`tremtec.com`) and then creates a GitHub release with generated notes. Tags that contain a hyphen are ignored.

```bash
git tag 1.2.3 && git push origin 1.2.3
```

Both workflows read these secrets from the `cloudflare` GitHub environment (Settings > Environments):

- `PULUMI_BACKEND_URL`: S3-compatible state bucket URL used by `infra/Pulumi.yaml`.
- `PULUMI_CONFIG_PASSPHRASE`: decrypts the stack secrets.
- `CLOUDFLARE_API_TOKEN`: lets the Pulumi Cloudflare provider manage the Worker, custom domains and redirect rules.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: access keys for the state bucket.

## Contributing

See [AGENTS.md](AGENTS.md) for architecture and code conventions. Lefthook formats staged files on commit and runs lint and tests on push.

## License

MIT, see [LICENSE](LICENSE).
