# Landing Page Improvements

## Goal

Make the landing page easier to scan, remove repeated product storytelling, and identify supported coding agents visually.

## Hero pipeline demo

Keep “Checkout recovery” centered when the board has enough content on both
sides while the six pipeline lanes slide beneath it. Do not add artificial
empty gutters: Product investigation remains left-aligned at the beginning,
Quality engineering remains right-aligned at the end, and the intermediate
stages center when possible. Advance through every stage in order every 2.5
seconds, then loop back to Product investigation. Hide horizontal overflow and
scrollbars so the demo reads as an automatic stage carousel rather than a
manually scrollable board.

Reduce the stage-title size and header spacing to more closely match the real
application. Shift the complete pipeline window toward the right side of the
hero while keeping its frame fully visible. At tablet and mobile widths, remove
the right offset and preserve the centered carousel behavior.

Provide a compact pause/play control for the continuously moving demo. When
reduced motion is requested, reset the feature to the first stage and do not
animate the lane strip. Recalculate the clamped alignment whenever the carousel
resizes.

## Lifecycle section

Replace the horizontally scrolling lifecycle track with a responsive card grid. The six lifecycle stages remain in their current order and keep their existing names, descriptions, and icons.

- Desktop: three columns and two rows.
- Tablet: two columns and three rows.
- Mobile: one column.
- Each card includes its sequence number so the route remains explicit.
- Sequence numbers and ordered-list semantics establish reading order without
  decorative connectors that become discontinuous at responsive row wraps.
- The ordered-list semantics and accessible label remain intact.
- Cards size to their content instead of reserving a fixed minimum height.
- Tighter card padding, icon spacing, grid gaps, heading spacing, and section
  padding reduce vertical scrolling without changing typography or copy.
- The section introduction explicitly identifies the displayed lifecycle as
  one example and tells users they can define any pipeline that fits their
  team.

## Pull request section

Remove the entire “From idea to pull request” section because the surrounding lifecycle, human-gate, and handoff sections already explain this flow. Remove its page import, component, section-specific styles, and dedicated test. Update the landing-page integration test to assert that the redundant heading is absent.

## Agent logos

Keep the existing supported-agent list:

- Claude Code
- Codex CLI
- Cursor CLI
- OpenCode
- Pi

Add a compact monochrome brand mark beside each agent name. The marks should use the current text color and preserve the existing visual language. Agent names remain visible text, so the decorative marks are hidden from assistive technology and do not replace accessible labels.

Prefer repository-owned SVG components or assets so the section has no runtime dependency on external image hosts.

## Testing

- Add focused component tests for lifecycle order and supported-agent labels.
- Update the landing-page integration test for the removed section.
- Run lint, type checking, unit tests, and the production build.
- Manually verify desktop and mobile layouts, card ordering, absence of horizontal overflow, section removal, and agent-logo rendering.
