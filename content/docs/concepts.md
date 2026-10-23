# How Bento works

A feature is a card that moves through pipeline stages. When a card enters a stage, that stage's agent runs in a sandbox with git worktrees of the project's repositories. Stages pass context through committed files under `docs/bento/<stage>.md`.

## Cards, sandboxes and worktrees

One card, one branch, one sandbox. The sandbox is created on the first agent run and reused for later stages on that card. Setup dependencies and caches from earlier runs remain available.

Hosted sandboxes outlive the server process. If the server restarts during a run, the sandbox continues and the server reattaches.

Follow-up messages resume the agent's session where the tool supports it. Otherwise Bento starts a new run with the stage prompt and a compacted transcript. See [Talking to a working agent](/docs/agents#talking-to-a-working-agent).

**Multi-repository projects.** Each repository gets a worktree under one feature workspace:

```
<data-dir>/worktrees/<featureId>/web
<data-dir>/worktrees/<featureId>/api
```

With one repository, the agent starts in that checkout. With several, it starts at the workspace root and the prompt lists each checkout. The first repository is primary: stage artifacts are written there, and project repository fields follow it.

## What a sandbox contains

Git, the coding agent CLIs, and no language runtime. Repository toolchains are installed via setup commands. See [repository commands](/docs/pipeline#repository-commands).

Local deployments use Docker containers (default) or an in-process driver with no isolation. Hosted deployments use Fly Sprites. All drivers share one interface. What a sandbox holds, and what it can reach, is covered in [Security](/docs/security).

## Spend

Spend is recorded per card and project when the tool reports it (see [Coding agents](/docs/agents)). Bento does not bill or enforce limits. Totals count unmeasured runs separately rather than as zero.

## Tenancy

Local mode: one user, no organizations, `organization_id` is null everywhere.

Multi mode: projects belong to an organization. All members of that organization see all of its projects. There is no per-project sharing.

Three isolation layers:

- Route checks re-read membership on every request.
- Row-level security confines queries to the caller's organization.
- Insert triggers derive `organization_id` from the parent row.
