# Task 7 report: Centered looping hero pipeline

## Outcome

Status: `DONE`

The updated Task 7 design and plan are implemented. The board has no synthetic
endpoint padding, all scroll targets are clamped, resize changes recenter the
active lane, reduced motion resets and stops the loop, and the compact
pause/play control and atomic live status are exposed accessibly.

## Strict TDD evidence

### Red

- Test-only commit: `32fedafe2a06f8d7059c2c3ed89a49fd464e26d8`
- The commit was pushed to `origin/cursor/improve-landing-page-45a5` before
  implementation.
- At that exact commit,
  `pnpm exec vitest run components/pipeline-demo.test.tsx` exited `1`.
- Result: 1 test file ran; 3 tests passed and 5 failed for the intended missing
  contracts: atomic live status, pause/play, reduced-motion reset, clamped
  endpoint positioning, and resize observation.

### Green

- Implementation commit: `354257319d38d5b145eea54832804557b65a40cb`
- The commit was pushed to `origin/cursor/improve-landing-page-45a5` before the
  green run.
- `pnpm exec vitest run components/pipeline-demo.test.tsx` exited `0`.
- Result: 1 test file and all 8 tests passed.

The focused tests cover pause/resume, reduced-motion activation and reset,
interval cleanup on unmount, clamping to `[0, scrollWidth - clientWidth]`,
resize recentering, the six-stage `2500ms` progression and wraparound, and
`aria-atomic="true"`.

## Implementation

- `components/pipeline-demo.tsx`
  - Retains the six-stage `2500ms` interval and modulo wraparound.
  - Clears the interval while paused, under reduced motion, and on unmount.
  - Resets the active stage to index `0` whenever reduced motion becomes active.
  - Clamps the center target between `0` and the board's maximum scroll offset.
  - Observes the board and lanes with `ResizeObserver` and recalculates the
    active target after size changes.
  - Adds a semantic pause/play button with changing accessible labels.
  - Marks the polite live status as atomic.
- `app/globals.css`
  - Removes synthetic inline board padding.
  - Preserves hidden overflow and hidden scrollbars.
  - Preserves the compact `70px` headers, `10px` titles, and right-aligned
    desktop hero frame with the tablet/mobile reset.
  - Styles the compact control at `26px` high.

## Real browser runtime

Chrome 148 loaded the real development page at `http://localhost:3000`.

- At `1440x900`, pausing held Product investigation for `2800ms`.
- After resuming, the observed order was UI/UX design, Engineering
  requirements, Implementation, Code review, Quality engineering, then Product
  investigation.
- The settled scroll offsets were clamped to their computed targets:
  `0`, `230`, `538`, `780`, `833`, then `0`. Quality engineering matched the
  `833px` maximum and Product investigation returned to `0px`.
- Resizing at Engineering requirements from `1440px` to `1200px` changed the
  target from `230px` to `296px`; the board immediately settled at `296px`.
- Computed board inline padding was `0px`.
- At `1440px`, the frame stayed inside the viewport from `654px` to `1407px`.
- At `390x844`, the frame stayed inside the viewport from `14px` to `376px`;
  document overflow remained `0px`, headers measured `70px`, and an
  intermediate lane matched its clamped target.
- The control measured `53x26px`, exposed the expected play/pause labels, and
  the live status exposed `aria-atomic="true"`.
- With `prefers-reduced-motion: reduce`, Product investigation remained at
  stage index `0` and `scrollLeft: 0` after `2800ms`. Dynamic activation and
  reset are additionally covered by the focused component test.

## Verification

- Focused test: passed, 1 file and 8 tests.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed, 18 files and 37 tests.
- `pnpm build`: passed; Next.js 16.2.12 generated all 18 static pages.
- Desktop/mobile Chrome runtime: all 16 behavioral and layout checks passed.

## Concerns

None.
