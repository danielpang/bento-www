# Task 7 report: Centered looping hero pipeline

## TDD evidence

### Red

- Test contract commit:
  `9b86fdcf963e507d9cd87b988bfae431ffc63cd6`
- `components/pipeline-demo.test.tsx` advances fake timers by `2500ms`
  for each stage, asserts all six stages in order, and asserts the sixth tick
  wraps to Product investigation.
- `pnpm exec vitest run components/pipeline-demo.test.tsx` exited `1` before
  implementation: 1 of 3 tests failed because UI/UX design was absent after
  the first `2500ms`. This was the intended failure against the existing
  one-shot `3000ms` timeout.

### Green

- Implementation commit:
  `ec1c765e05b61f124b944abf9f9cb6f257414f15`
- `pnpm exec vitest run components/pipeline-demo.test.tsx` exited `0`: 1 test
  file passed and all 3 tests passed.

## Architecture and files

- `components/pipeline-demo.test.tsx`
  - Defines the six-stage progression and wraparound contract with fake
    timers.
- `components/pipeline-demo.tsx`
  - Preserves the existing `LayoutGroup`, shared `layoutId`, six headings,
    active-card label, and polite live region.
  - Replaces the one-shot timeout with a `2500ms` interval and functional
    modulo state update.
  - Holds refs for the board and each lane. On every active-stage change, it
    computes the lane center relative to the board and scrolls that center
    into alignment.
  - Uses smooth positioning normally and instant positioning for reduced
    motion. Reduced-motion users do not start the interval, so the feature
    remains at Product investigation.
- `app/globals.css`
  - Uses a responsive fixed lane width and symmetric inline board padding,
    allowing both endpoint lanes to align with the board center.
  - Makes the board the lane offset reference and hides horizontal overflow
    and scrollbar rendering while retaining programmatic scrolling.
  - Reduces lane minimum height from `356px` to `342px`, header minimum height
    from `84px` to `70px`, header padding from `12px` to `10px`, title size
    from `11px` to `10px`, and agent top margin from `10px` to `8px`.
  - Right-aligns the desktop hero visual at a width reduced by
    `clamp(12px, 2vw, 28px)`. At `980px` and below it restores full width and
    stretch alignment.

## Runtime review

Headless Chrome loaded the real development page at `localhost:3000`.

- At `1440px`, the live feature visited Product investigation, UI/UX design,
  Engineering requirements, Implementation, Code review, Quality
  engineering, and Product investigation in order.
- Board `scrollLeft` values were `0`, `242`, `484`, `726`, `968`, `1210`,
  then `0`; the measured active-lane center differed from the board center by
  `0px` at every stage.
- At `1440px`, document overflow was `0px`; the frame occupied horizontal
  coordinates `660px` through `1422px`, fully inside the viewport.
- At `390px`, document overflow was `0px`; the frame occupied `14px` through
  `376px`, fully inside the viewport.
- The compact title computed to `10px`. The header measured `70px` without
  the desktop frame rotation and approximately `72px` in the rotated desktop
  frame.
- With `prefers-reduced-motion: reduce`, the feature remained at Product
  investigation after `3500ms`, centered with `scrollLeft: 0`.

Programmatic scrolling relies on standard `HTMLElement.scrollTo` support.
The optional call keeps non-layout test environments such as JSDOM safe.

## Exact verification outcomes

- Focused test: passed, 1 file and 3 tests.
- Lint: `pnpm lint` exited `0`; ESLint reported no errors.
- Typecheck: `pnpm typecheck` exited `0`; `tsc --noEmit` reported no errors.
- Full tests: `pnpm test` exited `0`; 18 files and 32 tests passed.
- Production build: `pnpm build` exited `0`; Next.js 16.2.12 compiled,
  completed TypeScript validation, and generated all 18 static pages.

## Concerns

None.
