# Landing Page Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the lifecycle scroller with an always-visible responsive grid, remove the redundant pull-request section, and add recognizable marks to the supported coding agents.

**Architecture:** Keep the landing page as a server-rendered composition. Add a focused `AgentLogo` SVG component for locally rendered, attributed monochrome marks, retain semantic ordered-list markup for the lifecycle, and implement all layout changes in the existing global stylesheet.

**Tech Stack:** Next.js 16 App Router, React 19 server components, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Keep all six lifecycle stages in their current order with existing names, copy, and icons.
- Render lifecycle cards in three, two, and one columns at desktop, tablet, and mobile breakpoints.
- Keep Claude Code, Codex CLI, Cursor CLI, OpenCode, and Pi as visible agent labels.
- Use monochrome, decorative logo marks without external runtime image hosts.
- Remove the complete “From idea to pull request” section and its unused implementation.

---

### Task 1: Responsive lifecycle route grid

**Files:**
- Create: `components/lifecycle-section.test.tsx`
- Modify: `components/lifecycle-section.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `LifecycleSection(): JSX.Element` continues to expose `#product` and the `Default product lifecycle` ordered list.
- Each list item exposes a two-digit `.lifecycle-step` marker from `01` through `06`.

- [ ] **Step 1: Write the failing lifecycle test**

Render `LifecycleSection`, assert the six headings remain in order, assert markers `01` through `06`, and assert the ordered list keeps its accessible name.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm test -- components/lifecycle-section.test.tsx`

Expected: FAIL because `.lifecycle-step` markers do not exist.

- [ ] **Step 3: Add sequence markers**

Inside each lifecycle list item, render:

```tsx
<span aria-hidden="true" className="lifecycle-step">
  {String(index + 1).padStart(2, "0")}
</span>
```

Keep the icon, heading, and description in their existing order.

- [ ] **Step 4: Replace scroller styles with a responsive grid**

Use `repeat(3, minmax(0, 1fr))` by default, `repeat(2, minmax(0, 1fr))` below 980px, and one column below 520px. Remove horizontal overflow, snap behavior, fixed card widths, and decorative connectors. Style cards with borders and raised surfaces; rely on sequence numbers and ordered-list semantics for a consistent reading order at every breakpoint.

- [ ] **Step 5: Run the focused test**

Run: `pnpm test -- components/lifecycle-section.test.tsx`

Expected: PASS.

### Task 2: Supported coding-agent marks

**Files:**
- Create: `components/agent-logo.tsx`
- Create: `components/handoff-section.test.tsx`
- Modify: `components/handoff-section.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `type AgentName = "Claude Code" | "Codex CLI" | "Cursor CLI" | "OpenCode" | "Pi"`.
- `AgentLogo({ agent, className? }: { agent: AgentName; className?: string }): JSX.Element` returns an `aria-hidden` SVG using `currentColor`.
- `agentTools` becomes a typed readonly list consumed by `HandoffSection`.

- [ ] **Step 1: Write the failing handoff test**

Render `HandoffSection`; assert all five visible labels and five `.agent-logo` SVG elements appear within the `Supported coding agents` region.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `pnpm test -- components/handoff-section.test.tsx`

Expected: FAIL because no `.agent-logo` elements exist.

- [ ] **Step 3: Implement `AgentLogo`**

Create a server-compatible component with local SVG path data for the Claude Code, Codex CLI, Cursor CLI, OpenCode, and Pi marks. Every SVG uses `viewBox`, `fill="currentColor"`, `focusable="false"`, and `aria-hidden="true"`.

- [ ] **Step 4: Render logos beside labels**

Replace each plain `<code>` body with:

```tsx
<code key={tool}>
  <AgentLogo agent={tool} className="agent-logo" />
  <span>{tool}</span>
</code>
```

Add spacing, a bounded logo box, and stronger label contrast while preserving the two-column and mobile one-column tool layouts.

- [ ] **Step 5: Run the focused test**

Run: `pnpm test -- components/handoff-section.test.tsx`

Expected: PASS.

### Task 3: Remove duplicated pull-request story

**Files:**
- Delete: `components/pull-request-section.tsx`
- Delete: `components/pull-request-section.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `Home()` no longer imports or renders `PullRequestSection`.
- The security section follows `HandoffSection` directly.

- [ ] **Step 1: Update the landing-page integration test**

Replace the positive pull-request heading assertion with:

```tsx
expect(
  screen.queryByRole("heading", { name: "From idea to pull request." }),
).not.toBeInTheDocument();
```

- [ ] **Step 2: Remove the section from the page**

Delete the `PullRequestSection` import and JSX call from `app/page.tsx`.

- [ ] **Step 3: Remove unused implementation and styles**

Delete both pull-request component files. Remove `.pr-section`, publish-flow, review-proof, and diff-preview selectors plus their responsive overrides from `app/globals.css`.

- [ ] **Step 4: Run landing-page tests**

Run: `pnpm test -- app/page.test.tsx components/lifecycle-section.test.tsx components/handoff-section.test.tsx`

Expected: PASS.

### Task 4: Full verification and walkthrough

**Files:**
- Modify only if a check reveals a defect.

- [ ] **Step 1: Commit and push the implementation**

Run:

```bash
git add app components
git commit -m "feat: improve landing page feature story"
git push -u origin cursor/improve-landing-page-45a5
```

- [ ] **Step 2: Run all required checks**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

Expected: all commands exit successfully.

- [ ] **Step 3: Verify in the browser**

At desktop and mobile widths, confirm:

- all six lifecycle cards are visible in reading order without horizontal overflow;
- five agent marks render beside the correct labels;
- the pull-request section is absent;
- the handoff and security sections meet without broken spacing or borders.

- [ ] **Step 4: Record the successful walkthrough**

Create one concise desktop-to-mobile recording showing the lifecycle grid, agent marks, and transition from handoff to security.

- [ ] **Step 5: Commit any verification fixes and update the pull request**

If verification required changes, commit them separately, push the branch, and update the draft pull-request summary and test results.

## Final verification evidence

Verification completed on 2026-08-04:

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test` passed: 18 test files and 31 tests.
- `pnpm build` passed.
- Browser testing at exactly 390x844 and 100% zoom measured
  `window.innerWidth === document.documentElement.scrollWidth === 390`.
  Only the hero pipeline intentionally scrolled within its own container.
- Desktop rendered the lifecycle as a 3x2 grid; mobile rendered one column.
- All five supported coding agents rendered distinct marks.
- The “From idea to pull request” section was absent, and the security section
  followed the handoff section directly.

User-facing walkthrough artifacts:

- `/opt/cursor/artifacts/lifecycle_grid_complete.mp4`
- `/opt/cursor/artifacts/coding_agent_logos_framed.mp4`

The artifact binaries remain outside the repository.

### Task 5: Compact lifecycle cards

**Files:**
- Modify: `app/globals.css`
- Modify: `components/lifecycle-section.tsx`
- Modify: `components/lifecycle-section.test.tsx`

**Interfaces:**
- The lifecycle keeps its content, ordered-list semantics, and 3/2/1-column
  responsive behavior.
- Decorative connector markup is removed; ordered step markers communicate
  row-major reading order at every breakpoint.

- [ ] **Step 1: Remove reserved card height**

Remove `min-height: 230px` from `.lifecycle-track li` so each card sizes to
its content.

- [ ] **Step 2: Tighten section and card spacing**

Apply these exact values:

```css
.section.lifecycle-section {
  padding-block: clamp(64px, 7vw, 96px);
}

.lifecycle-section .section-heading {
  margin-bottom: clamp(30px, 4vw, 44px);
}

.lifecycle-track {
  gap: 12px;
}

.lifecycle-track li {
  padding: 22px;
}

.lifecycle-step {
  top: 22px;
  right: 22px;
}

.lifecycle-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 18px;
}
```

Keep the grid free of decorative connectors so row wraps do not introduce
missing transitions, U-turns, or a misleading snake order.

- [ ] **Step 3: Run automated checks**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

Expected: all commands exit successfully.

- [ ] **Step 4: Verify compactness in the browser**

At desktop and 390x844 mobile widths, confirm:

- cards have no large blank area below their descriptions;
- all copy, icons, markers, and borders remain visible;
- no decorative connectors render between cards;
- desktop remains three columns and mobile remains one column;
- document-level horizontal overflow remains absent;
- the lifecycle section requires materially less vertical scrolling.

### Task 6: Clarify pipeline configurability

**Files:**
- Modify: `components/lifecycle-section.tsx`
- Modify: `components/lifecycle-section.test.tsx`

**Interfaces:**
- `LifecycleSection()` keeps its existing heading, grid, and lifecycle stages.
- The section introduction must render this exact copy:
  “This is one example. Define any pipeline you want, with the stages, agents,
  skills, and rules that fit your team.”

- [ ] **Step 1: Add a failing copy assertion**

Render `LifecycleSection` and assert the approved configurability sentence is
visible.

- [ ] **Step 2: Run the focused test**

Run: `pnpm exec vitest run components/lifecycle-section.test.tsx`

Expected: FAIL because the section still renders the previous introduction.

- [ ] **Step 3: Replace the introduction**

Replace only the paragraph beneath “Every feature has a route.” with the exact
approved copy. Do not alter card content or layout.

- [ ] **Step 4: Verify the update**

Run the focused test, lint, typecheck, full test suite, and production build.
In the browser, confirm the full sentence is readable on desktop and mobile
without changing the compact grid or creating horizontal overflow.
