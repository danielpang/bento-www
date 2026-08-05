# Task 8 report: Condensed mobile lifecycle and pipeline cards

## Red browser evidence

The temporary CDP measurement script loaded the real development page in
headless Chrome 148 at `390x844` before any Task 8 production CSS changed.

- The first lifecycle card measured `169.78125px` high.
- The pipeline lane measured `210px` wide by `342px` high.
- The live pipeline card measured `194px` wide by `84px` high.
- Icon, title, and number were not on one row. Their top coordinates were
  `1240.5625px`, `1294.5625px`, and `1240.5625px`, respectively, so the title
  began `54px` below the icon and number.
- Computed lifecycle item layout was `display: list-item`, with no grid template
  or named areas.

## Implementation

The exact Task 8 rules were added only inside the existing `max-width: 520px`
media query in `app/globals.css`. The CSS was committed and pushed as
`b446c1fd93873a9ea961a89e207af36e760cb066` before green testing.

## Green browser evidence

The temporary CDP measurement script loaded the real hydrated development page
in headless Chrome 148 at both required viewport sizes.

### Lifecycle

- At both `390x844` and `320x700`, the first card measured `116.28125px` high.
- Computed grid areas were `"icon title step" ". copy ."`.
- The computed columns were `32px 252.594px 15.4062px` at `390px` and
  `32px 182.594px 15.4062px` at `320px`.
- Computed gaps were `12px` by `6px`, and padding was `18px`.
- Every one of the six cards placed icon, title, and number on the same row,
  aligned its description below the title, rendered all text without clipping,
  and had no content overlap.
- Icon dimensions were exactly `32x32px`; its bottom margin was `0px`.
- The number used the `step` area and static positioning; the title used the
  `title` area with the full available track width; the description used the
  `copy` area with `0px` top margin.

### Pipeline

At both viewports:

- Each lane measured exactly `180x280px`.
- The header measured exactly `180x60px`, with `8px` padding.
- The cards area measured exactly `180x220px`, with `6px` padding and gap.
- The live card measured `168x69px`; its computed minimum height was exactly
  `66px`, with `8px` padding and `6px` gap. Its content makes its used height
  `3px` taller than the minimum.
- Pipeline card title size was exactly `10px`.
- Agent top margin and font size were exactly `6px` and `9px`.
- All card text was readable without clipping, and all pipeline card content
  passed rectangle overlap checks.
- The board computed `overflow-x: hidden`, `scrollbar-width: none`, and
  `::-webkit-scrollbar { display: none }`.
- Document-level horizontal overflow was exactly `0px`.

### Carousel

The real `2500ms` progression advanced through all six lanes. Every settled
scroll offset matched the computed clamped center target:

- `390x844`: `0`, `92`, `274`, `456`, `638`, `730`; the last value equaled
  the `730px` maximum.
- `320x700`: `0`, `127`, `309`, `491`, `673`, `800`; the last value equaled
  the `800px` maximum.

The first and final stages therefore clamped to their endpoints, all four
intermediate stages centered correctly, and pause/resume controls changed their
accessible labels after hydration at both sizes.

## Verification

- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed, 18 files and 37 tests.
- `pnpm build`: passed; Next.js 16.2.12 generated all 18 static pages.
- Required browser runtime checks: passed at `390x844` and `320x700`.
- Temporary measurement script: removed.

## Outcome

Status: `DONE`

Concerns: None.

