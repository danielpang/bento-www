<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Package manager: `pnpm` (lockfile committed). Install with `pnpm install --frozen-lockfile`.
- Dev server: `pnpm dev` on port 3000 (started via the configured cloud terminal).
- Checks before finishing work: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- Public site URLs live in committed `.env` / `.env.example` (`NEXT_PUBLIC_SIGNUP_URL`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_SITE_URL`). Override locally with `.env.local` if needed.
