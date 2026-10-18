# Security

Bento runs untrusted agent code in isolated environments. Credentials stay on the server; agents receive scoped access for the work they need, not your host identity.

## Per-feature sandbox isolation

Each card gets its own sandbox: **one card, one branch, one sandbox**. Agent runs use git worktrees of your repositories inside that environment, not your laptop's checkout. Local deployments can use Docker containers (default) or an in-process driver without isolation; hosted deployments use Fly Sprites. See [How it works](/docs/concepts#cards-sandboxes-and-worktrees) for drivers and worktree layout.

## Scoped GitHub access

Agents commit inside the sandbox. **Opening or updating a pull request is a separate server-side step**; agents do not receive push credentials. The server uses short-lived GitHub tokens narrowed to the repository being published, and rejects pushes to protected default branches. Details: [Pull requests](/docs/pull-requests).

Hosted teams connect a GitHub App and select repositories; Bento stores short-lived installation tokens per organization. Self-hosted and local installs can use a personal access token in settings or `.env` instead.

## Encrypted organization credentials

Model and tool credentials for your organization are **encrypted at rest** and resolved **only for the owning agent run**. Agents never receive host SSH keys or host git configuration.

## Team and data boundaries

In multi-tenant hosted mode, projects belong to an organization. Route handlers re-check membership on every request; row-level security confines queries to the caller's organization. See [How it works](/docs/concepts#tenancy).

## Self-host vs managed

**Self-host** with Docker (or run the TUI locally) when you want the board, history, and sandboxes on infrastructure you control. **Managed** Bento at [app.usebento.ai](https://app.usebento.ai/) runs the shared board and hosted sandboxes for the team; model API keys stay with you on every plan. Compare [Web UI](/docs/web-app) run modes and [pricing](/pricing).

This page describes the product's security model as documented here. It is not a certification or compliance attestation.
