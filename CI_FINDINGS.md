# CI/CD Pipeline Warning Investigation - Findings

## Summary

Investigated and fixed all warnings from the Quality Gateway, CodeQL, Deploy, and Release workflows. Each fix is implemented in this PR.

---

## 1. Node.js 20 Deprecation Warnings ✅ FIXED

**Problem**: Actions targeting Node.js 20 forced onto Node 24:

- `actions/checkout@v4`
- `actions/setup-node@v6`
- `oven-sh/setup-bun@v2`
- `github/codeql-action@v4`
- `pulumi/actions@v6`

**Fix**: Updated all actions to latest major versions supporting Node 24 natively:
| Action | Old | New | Pinned SHA |
|--------|-----|-----|------------|
| actions/checkout | v4 | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/setup-node | v6 | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| oven-sh/setup-bun | v2 | v2.2.0 | `0c5077e51419868618aeaa5fe8019c62421857d6` |
| github/codeql-action | v4 | v4.39.4 | `e0462179768953fd6790193e15caaef674ff709e` |
| pulumi/actions | v6 | v7.1.0 | `96c7761824268174e0d2a4e8c7d75671eebd24a7` |

**Files changed**: All 4 workflow files (`.github/workflows/*.yml`)

---

## 2. Ubuntu 26 Migration Warning ✅ FIXED (by pinning)

**Problem**: `ubuntu-latest` will migrate to Ubuntu 26 on October 19, 2026.

**Fix**: Pinned all runners to `ubuntu-24.04` for stability and reproducibility. This gives us control over when to migrate.

**Files changed**: All 4 workflow files

---

## 3. Punycode Deprecation Warning (DEP0040) ✅ FIXED

**Problem**: Pulumi action's Node runtime emitted `punycode` deprecation warning.

**Fix**: Upgraded `pulumi/actions` from v6 to v7.1.0 (pinned by SHA), which uses a newer Node runtime without this warning.

**Files changed**: `.github/workflows/deploy.yml`, `.github/workflows/release.yml`

---

## 4. Unpinned Tool Versions ✅ FIXED

**Problem**: Workflows used `bun-version: latest` and Node `lts/*`, causing non-reproducible builds.

**Fix**: Pinned to specific versions:

- Node.js: `22` (current LTS)
- Bun: `1.2.17` (matches `bun.lock`)

**Files changed**: All 4 workflow files

---

## 5. Actions Pinned by Tag, Not Commit SHA ✅ FIXED

**Problem**: Actions referenced by tag (mutable), not immutable commit SHA. `pulumi/actions` receives 5 deploy secrets.

**Fix**: All actions now pinned by commit SHA with version comments for readability.

**Files changed**: All 4 workflow files

---

## 6. Dev Deploy Not Gated on Quality Gateway ✅ FIXED

**Problem**: Deploy workflow ran on every push to `main`, in parallel with Quality Gateway checks.

**Fix**: Changed Deploy trigger from `push` to `workflow_run` on Quality Gateway completion with `conclusion == 'success'`. Deploy now only runs after Quality Gateway passes.

**Files changed**: `.github/workflows/deploy.yml`

---

## 7. Worker Version Replacement on Every Deploy ✅ FIXED

**Problem**: `compatibilityDate: today()` in `infra/index.ts` caused a new WorkerVersion to be created on every deploy (Pulumi plan showed `creating replacement`).

**Fix**: Changed to fixed `COMPATIBILITY_DATE = "2026-02-03"` constant. Update intentionally when adopting new Workers runtime features.

**Files changed**: `infra/index.ts`

---

## 8. Default Workflow Token Permission ✅ DOCUMENTED

**Problem**: Repository default workflow token permission is `write` (repo setting). Workflows set `contents: read`, but default should be read-only.

**Fix**: This is a repository setting, not a workflow file change. **Action required**: Go to Settings → Actions → General → Workflow permissions → select "Read repository contents permission" and save.

**Status**: Documented here, requires manual repo setting change.

---

## 9. Dependabot for GitHub Actions ✅ ADDED

**Added**: `.github/dependabot.yml` with:

- Weekly checks for GitHub Actions updates (grouped, minor/patch only)
- Weekly checks for npm dependencies (dev and production groups)
- Ignore `@types/node` >= 22 (matches pinned Node 22)

---

## Validation

All checks pass locally:

- `bun run lint` ✅ (Biome + astro check)
- `bun run test` ✅ (61 tests)
- `bun run build` ✅ (Astro + Cloudflare build)

---

## Decisions to Defer

None - all identified warnings have been addressed.

---

## Next Steps

1. Merge this PR
2. Update repository workflow permissions to read-only (Settings → Actions → General)
3. Monitor first few workflow runs to confirm no warnings
4. Update `COMPATIBILITY_DATE` in `infra/index.ts` when intentionally adopting new Workers runtime features
