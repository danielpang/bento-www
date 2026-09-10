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
- `NEXT_PUBLIC_POSTHOG_KEY`: public token of the same PostHog project as the
  hosted console. When set, every marketing page records `$pageview` and
  `$pageleave` (tagged `service: bento-www`) through a lazily loaded
  posthog-js; when empty, no analytics script loads.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog ingestion host, `https://us.i.posthog.com` by default.

If the signup or GitHub URL is absent, its CTA renders as an accessible disabled control instead of a broken link.

## Search and answer engines

- `next.config.ts` redirects `www.usebento.ai`, `usebento.dev`, and
  `www.usebento.dev` to the same path on `https://usebento.ai` with a 301.
  On Vercel the alias domains must be attached to the project as plain
  domains (not dashboard "Redirect to" entries) for these rules to run.
- Every page carries Organization, WebSite, and SoftwareApplication JSON-LD
  built from `lib/copy.ts` and `lib/pricing.ts`; `/pricing` adds FAQPage
  markup from its questions section. See `lib/structured-data.ts`.
- Docs guides written to answer a problem query (starting with
  `/docs/handoff-artifacts`) lead with the question as their `heading` in
  `lib/docs.ts` (the H1 and document title), keep a short `title` for the
  navigation and index, open with a direct answer, and link into the
  reference guides for depth rather than repeating them. They may carry
  `questions`, rendered as a closing Questions section and as FAQPage
  JSON-LD from the same entries. The docs index, sitemap, and `/llms.txt`
  pick up new guides from `listDocs()`.
- Several unrelated products are called Bento. `siteDisambiguation` in
  `lib/copy.ts` is the one sentence that says which one this is. It is for
  crawlers and answer engines only: quoted in `/llms.txt` and set as
  `disambiguatingDescription` on the Organization and SoftwareApplication
  nodes, never rendered on a page. Edit it in one place.
- `/llms.txt` is a plain-text one-pager for agents and crawlers, generated
  from the same copy, docs, and pricing catalog. See `lib/llms.ts`.
- The homepage is cached by shared caches (`s-maxage` with
  `stale-while-revalidate`) while the experiment below is off, and
  `private, no-store` while it assigns variants.

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
