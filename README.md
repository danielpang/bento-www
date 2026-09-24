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
- Several unrelated products are called Bento. `siteDisambiguation` in
  `lib/copy.ts` is the one sentence that says which one this is. It is for
  crawlers and answer engines only: quoted in `/llms.txt` and set as
  `disambiguatingDescription` on the Organization and SoftwareApplication
  nodes, never rendered on a page. Edit it in one place.
- `/llms.txt` is a plain-text one-pager for agents and crawlers, generated
  from the same copy, docs, and pricing catalog. See `lib/llms.ts`.
## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Homepage

The developer-focused marketing homepage is served at `/`. Retired redesign
preview and control URLs redirect to the homepage.

Browser checks: `pnpm exec playwright install chromium`, then `pnpm test:e2e`.

## Mac downloads

The homepage CTA, navigation, and footer link to `/download`. The stable
URLs `/download/mac/arm64` and `/download/mac/x64` redirect to uploaded DMGs
on public `danielpang/bento` GitHub Releases. No GitHub token is required.

The resolver skips drafts, prereleases, non-stable version tags, and CLI-only
releases. It selects the first matching release in GitHub's release listing,
following pagination when needed. Tags are `v{version}` or `{version}` and
assets must be named `Bento-{version}-arm64.dmg` or
`Bento-{version}-x64.dmg`. Missing architectures remain unavailable.
Metadata is shared through Next's fetch cache for five minutes, with an
eight-second timeout per request; download redirects are never cached.
Before the first Mac release, visitors see an unavailable message. GitHub
failures show retry and releases links. Neither case invents a download URL.

Both chips stay selectable. When the browser supplies macOS, 64-bit, and
architecture [User-Agent Client Hints](https://developer.chrome.com/docs/privacy-security/user-agent-client-hints),
the page offers a suggestion without automatically choosing or downloading.
Safari, missing hints, and other platforms retain the manual choice. Legacy
`MacIntel` and `Intel Mac OS X` identifiers are never used to infer a chip.

Run `pnpm exec playwright test e2e/download.spec.ts` to check the live flow.
Release fixtures and failure cases are covered by `lib/mac-releases.test.ts`
and `app/download/mac/[arch]/route.test.ts`.
