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

## Marketing redesign and A/B experiment

Preview the redesign at `/preview/redesign` and the preserved current homepage
at `/preview/control`. Pricing and changelog retain the existing catalog and
release history with the new visual treatment.

The PostHog homepage experiment is opt-in and defaults to the control in
production. See [the experiment runbook](docs/marketing-experiment.md) for the
50/50 flag configuration, completed-signup metric, identity verification, and
launch steps. It has not been launched by this code change.

Browser checks: `pnpm exec playwright install chromium`, then `pnpm test:e2e`.
