# Landing Page Improvements

## Goal

Make the landing page easier to scan, remove repeated product storytelling, and identify supported coding agents visually.

## Lifecycle section

Replace the horizontally scrolling lifecycle track with a responsive card grid. The six lifecycle stages remain in their current order and keep their existing names, descriptions, and icons.

- Desktop: three columns and two rows.
- Tablet: two columns and three rows.
- Mobile: one column.
- Each card includes its sequence number so the route remains explicit.
- Subtle connectors reinforce reading order without requiring scrolling or interaction.
- The ordered-list semantics and accessible label remain intact.

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
