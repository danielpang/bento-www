# Third-Party Notices

## Open Design agent icons

`components/agent-logo.tsx` contains SVG path data adapted from the following
files in [`nexu-io/open-design`](https://github.com/nexu-io/open-design):

- [`apps/landing-page/public/agent-icons/claude.svg`](https://github.com/nexu-io/open-design/blob/8359fb6d2c254fb83716b35a4ad7863a6221bc28/apps/landing-page/public/agent-icons/claude.svg)
- [`apps/landing-page/public/agent-icons/codex.svg`](https://github.com/nexu-io/open-design/blob/8359fb6d2c254fb83716b35a4ad7863a6221bc28/apps/landing-page/public/agent-icons/codex.svg)
- [`apps/landing-page/public/agent-icons/cursor-agent.svg`](https://github.com/nexu-io/open-design/blob/8359fb6d2c254fb83716b35a4ad7863a6221bc28/apps/landing-page/public/agent-icons/cursor-agent.svg)
- [`apps/landing-page/public/agent-icons/opencode.svg`](https://github.com/nexu-io/open-design/blob/8359fb6d2c254fb83716b35a4ad7863a6221bc28/apps/landing-page/public/agent-icons/opencode.svg)
- [`apps/landing-page/public/agent-icons/pi.svg`](https://github.com/nexu-io/open-design/blob/8359fb6d2c254fb83716b35a4ad7863a6221bc28/apps/landing-page/public/agent-icons/pi.svg)

Copyright 2026 Open Design contributors.

The source files are licensed under the Apache License, Version 2.0. The
complete license text is in [`licenses/Apache-2.0.txt`](licenses/Apache-2.0.txt).

### Modifications

The five source SVGs were converted into React JSX path elements, collected in
one typed component, and changed to render as monochrome decorative marks using
the parent SVG's `fill="currentColor"`. Source-specific colors and standalone
SVG metadata were removed. The original path geometry and view boxes were
retained, with the Pi mark retaining its two-path structure.

### Trademarks

The Apache License does not grant trademark rights. Claude and Claude Code are
marks of Anthropic PBC; Codex is a mark of OpenAI; Cursor is a mark of
Anysphere, Inc.; OpenCode is a mark of Anomaly; and Pi's name and logo are
trademarks of Earendil. All product names and logo marks remain the property of
their respective owners. Their inclusion identifies supported tools and does
not imply sponsorship or endorsement.
