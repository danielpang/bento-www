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

### Task 7: Centered looping hero pipeline

**Files:**
- Modify: `components/pipeline-demo.tsx`
- Modify: `components/pipeline-demo.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- `PipelineDemo()` continues to expose the six stage headings and the live
  region describing the active “Checkout recovery” stage.
- The active stage advances every `2500ms` and wraps from stage index `5` to
  index `0`.
- The board centers intermediate active lanes programmatically while hiding
  horizontal overflow and visible scrollbars. Its scroll target is clamped so
  stage one is left-aligned and stage six is right-aligned without empty
  endpoint gutters.
- A visible pause/play button controls the indefinite animation.

- [ ] **Step 1: Write failing progression tests**

Use fake timers to assert that “Checkout recovery” visits all six stages in
order at 2500ms intervals and returns to Product investigation after the sixth
interval.

- [ ] **Step 2: Run the focused test**

Run: `pnpm exec vitest run components/pipeline-demo.test.tsx`

Expected: FAIL because the current demo advances once after 3000ms and stops.

- [ ] **Step 3: Implement looping progression and centering**

Replace the one-shot timeout with an interval using a functional state update:

```tsx
setActiveStage((stage) => (stage + 1) % stages.length);
```

Keep references to the board and stage lanes. Whenever the active stage
changes, scroll the board toward the active lane center, clamped between `0`
and `scrollWidth - clientWidth`. Recalculate after board or lane resizes. Use
instant positioning for reduced motion and smooth positioning otherwise.
Reset to stage one whenever reduced motion becomes active.

- [ ] **Step 4: Convert the board into a hidden-overflow carousel**

Use a fixed responsive lane width without synthetic inline padding. Hide
horizontal overflow and scrollbars. Reduce the lane header from `84px` to
`70px`, its padding from `12px` to `10px`, the title from `11px` to `10px`,
and the agent top margin from `10px` to `8px`. Reduce the lane minimum height
by the same 14px.

Add a compact pause/play button to the window bar. Pausing stops stage updates;
resuming restarts the 2500ms interval. Mark the live status `aria-atomic`.

- [ ] **Step 5: Shift the hero visual right**

On desktop, align `.hero-visual` to the right and reduce its width by
`clamp(12px, 2vw, 28px)` so its left edge moves right while the full frame
remains inside the shell. At `980px` and below, restore full width and remove
the offset.

- [ ] **Step 6: Verify behavior**

Run the focused test, lint, typecheck, full test suite, and production build.
Manually verify:

- intermediate stages center while stage one stays left-aligned and stage six
  stays right-aligned, without empty endpoint gutters;
- the sequence loops cleanly from stage six to stage one;
- pause/play controls the ongoing animation;
- no horizontal scrollbar or document overflow appears;
- smaller stage headers remain readable;
- the full pipeline frame stays visible on desktop and mobile;
- reduced-motion activation resets to stage one and remains stationary;
- resize and breakpoint changes immediately preserve clamped alignment.

### Task 8: Condense mobile lifecycle and pipeline cards

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Desktop and tablet lifecycle layouts remain unchanged.
- Mobile lifecycle cards keep the existing semantic order and content.
- The hero carousel keeps its clamped 2500ms progression behavior.

- [ ] **Step 1: Capture failing mobile measurements**

At `390x844`, record the current lifecycle card height, pipeline lane width,
pipeline lane height, and live pipeline card height. Confirm the current layout
does not place icon, title, and number on one row.

- [ ] **Step 2: Create the mobile lifecycle row**

At `520px` and below, make each lifecycle list item a grid:

```css
grid-template-columns: 32px minmax(0, 1fr) auto;
grid-template-areas:
  "icon title step"
  ". copy .";
```

Use `18px` card padding, `12px` column gaps, and `6px` row gaps. Place the
icon, heading, step number, and description in their named areas. Make the step
number static, reduce the icon to `32px`, remove its bottom margin, remove the
description top margin, and allow the title to use its available width.

- [ ] **Step 3: Condense the mobile hero pipeline**

At `520px` and below:

- set `--pipeline-lane-width` to
  `min(180px, calc(100vw - 56px))`;
- reduce lane minimum height to `280px`;
- reduce header minimum height to `60px` with `8px` padding;
- reduce agent top margin to `6px` and font size to `9px`;
- reduce cards-area minimum height to `220px`, padding to `6px`, and gap to
  `6px`;
- reduce pipeline card minimum height to `66px`, padding to `8px`, and gap to
  `6px`;
- reduce pipeline card title text to `10px`.

- [ ] **Step 4: Verify mobile behavior**

At `390x844` and `320x700`, confirm:

- lifecycle icon, title, and number share one row;
- the description aligns beneath the title;
- all card text remains readable without overlap or clipping;
- pipeline lanes and cards use the exact compact dimensions;
- first/intermediate/final carousel alignment still clamps correctly;
- no visible horizontal scrollbar or document-level overflow appears.

Run lint, typecheck, the full test suite, and the production build.
