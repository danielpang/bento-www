# Bento marketing site

The public landing page for [Bento](../bento), the orchestrator for moving product features through a team of coding agents.

## Local development

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

- `NEXT_PUBLIC_SIGNUP_URL`: account creation destination.
- `NEXT_PUBLIC_GITHUB_URL`: Bento repository.
- `NEXT_PUBLIC_SITE_URL`: canonical origin for metadata and the sitemap.

If the signup or GitHub URL is absent, its CTA renders as an accessible disabled control instead of a broken link.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
