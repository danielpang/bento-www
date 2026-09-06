# Homepage signup experiment

Status: implemented locally; the PostHog experiment has not been created or launched, and this change has not been deployed. No conversion results exist yet.

## What is being compared

- Flag key: `marketing-homepage-v2`.
- `control` (50%): homepage pulled from `origin/main` at `09bdfb0`, preserved in `components/marketing/control-home.tsx` with its original CSS and components.
- `redesign` (50%): developer-focused homepage with a charcoal theme, clearer product promise, and the existing interactive pipeline beside the headline.
- Both cohorts use the same redesigned pricing and changelog destinations, with the existing plans, prices, release history, URLs, and signup destination. This experiment measures the homepage treatment, not pricing changes.
- `/preview/control` and `/preview/redesign` are noindex previews and do not record experiment events. `/control` redirects to the control preview on direct requests.

## Configuration

Use the same PostHog project as `app.usebento.ai`. Its public `/api/health` endpoint reports the US ingestion region. The public project token is available there or in PostHog project settings. A public project token can evaluate flags and capture events; it cannot create experiments.

Set these at build time in the marketing deployment:

```
NEXT_PUBLIC_POSTHOG_KEY=<same public project token as the hosted app>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED=true
```

These values are also documented in `.env.example`. Never place a personal API key in `NEXT_PUBLIC_*` variables. When disabled, production serves the original homepage; local development serves the redesign. Explicit preview URLs work in either mode.

## Create in PostHog

1. Create a web experiment named **Developer homepage → completed signups**, with flag key `marketing-homepage-v2`. Hypothesis: the clearer agent-orchestration story and developer-oriented presentation increase completed account creation.
2. Configure user-level variants `control` and `redesign`, each at 50%. Target production acquisition traffic. Enable PostHog's internal/test-account exclusion; the code additionally excludes known crawlers, identified account holders, and opted-out visitors. Do not change the allocation during the run.
3. Use the default `$feature_flag_called` exposure, filtered to this flag. The code records this only after the matching page has rendered, not during server evaluation or prefetch. Exclude users exposed to multiple variants.
4. Primary metric: a **funnel conversion** from exposure to **`user signed up`**, with a 7-day conversion window. Count unique converted people. This is the existing server event emitted only after a persisted user row is confirmed in `bento/apps/server/src/server.ts`.
5. Secondary metric: conversion from exposure to **`marketing signup clicked`**. This is intent, not completed account creation. Use device and acquisition-source breakdowns to inspect results. If an existing activation event is available, add it as a downstream quality metric.
6. Before launch, complete the identity check below. Estimate required sample size in PostHog from the actual signup baseline and a minimum lift worth shipping. Run across at least two full weekly cycles and until the planned sample is reached; allow the conversion window to mature. Do not declare a winner from a few clicks or repeatedly stop on a favorable reading.
7. Deploy, confirm both cohorts in live events, then launch the experiment. Record the experiment URL here. Stop by disabling the flag or setting the enable variable to false and redeploying; the fallback is control. A later winner rollout should be explicit.

## Signup identity check (required before launch)

The marketing page uses a stable anonymous identity for both server evaluation and browser capture. PostHog persists it on the parent domain with `cross_subdomain_cookie: true`. Both configured URLs now use `usebento.ai`. No identity is added to signup URLs.

The adjacent app already initializes `posthog-js` with the same project token, and calls `identifyUser(userId)` after authentication. That identify call must merge the marketing anonymous identity with the user ID used by the server's `user signed up` event. The server can emit its event before the browser identifies; the person merge links them afterward.

Verify this in a fresh browser on a staging deployment with sibling subdomains and a test PostHog project (or a clearly excluded internal account):

- Open the homepage and confirm exactly one rendered variant and its exposure event.
- Follow a signup CTA, complete a test signup, and confirm exposure and `user signed up` belong to the same PostHog person. Confirm it also works via `/pricing`.
- Confirm the app's identity initialization occurs before its identify call, including OAuth redirects. If that app behavior changes, fix identity there before launch.
- Reject/failed signup attempts must not produce `user signed up`. Preview visitors must not produce exposure events.

Cookie sharing does not cross unrelated domains. If signup moves away from a sibling of `usebento.ai`, this attribution requires additional application-side identity handoff. Browser blockers and opt-outs reduce the measurable population. No real account was created and no production analytics events were sent while implementing this change, so cross-subdomain conversion is not yet verified end to end.

## Implementation and failure handling

`proxy.ts` evaluates the PostHog `/flags?v=2` endpoint with a 1.2-second timeout and rewrites to the control before HTML rendering. It never swaps the page after hydration. Assignment responses are private/no-store. Unknown/disabled flags, errors, quota limits, and timeouts fall back to the control without enrolling the visitor. Preview paths do not evaluate flags.

`MarketingAnalytics` records exposure and signup clicks with `$feature/marketing-homepage-v2`. Autocapture, pageviews, session recording, and surveys are disabled. It never creates a completed-signup event and never delays navigation. Attribution survives navigation to pricing/changelog via the assignment cookie. Repeated signup clicks are possible; the experiment metric must count converted people, not total clicks.

## Checks

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`.

Unit tests cover both variants, shared identity, opt-out/account exclusion, failure fallback, preview isolation, exact signup-destination matching, and separate intent events. Browser tests check both previews, desktop/mobile overflow, the two-line desktop headline, pipeline placement/control, and the mobile navigation.

References: [PostHog experiment setup](https://posthog.com/docs/experiments/creating-an-experiment), [flags API](https://posthog.com/docs/api/flags), [Next.js integration and identity](https://posthog.com/docs/libraries/next-js).
