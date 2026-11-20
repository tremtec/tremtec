# Roadmap

- [ ] enh: publish posts made in MacOS

- [ ] ref: move private pages under /admin
- [ ] ref: clean up project removing boilerplate info
- [ ] ref: revamp UI/UX and color scheme to match branding
- [x] ref: decide on an i18n approach for UI copy
  - copy lives in `src/ui/contents/*.ts` (single language, not i18n)
  - Astro has i18n routing (`i18n` config, `astro:i18n`) but no string translation
  - decide: URL strategy (`/pt-br/` prefix?), string storage and lookup, blog/products localisation, locale for the signed-in app
  - deliver: short ADR + one page migrated as reference
  - done: [docs/adr/0001-i18n.md](docs/adr/0001-i18n.md), `en` and `pt-br` across the site and dashboard

- [ ] debt: set sitemap environment domain during pulumi deployment

- [ ] fea: contact form
  - [ ] fea: website
    - contact form (name, email, subject, message)
    - turnstile to prevent spam
    - `send_email` to team on submission
    - `send_email` to user on submission
  - [ ] fea: admin dashboard
    - view contact form submissions
    - mark status as read/unread/contacted/waiting response
    - delete

- [ ] fea: admin dashboard to manage users
  - [ ] admin: list all users with pagination
  - [ ] admin: show users with
    - id, name, email
    - status (active, pending, suspended)
    - role (admin, user)
    - timestamps (created_at, last_login)
  - [ ] login flow:
        Login ->
        if @tremtec.com email -> redirect to dashboard
        else -> redirect to "Thank you for your interest, we'll be in touch!"

## Done

### 2026-04-09

- [x] sitemap support
- [x] enh: set up pulumi S3 bucket
