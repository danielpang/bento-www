# TUI

Bento's board in your terminal, with agents in sandboxes on your machine or on the hosted server.

## Install the CLI

Requires Node.js 22.19+, `curl` and `tar` on macOS or glibc Linux (x64, ARM64). On Windows, use [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install). Local agents need Docker running.

```sh
curl -fsSL https://usebento.ai/install.sh | sh
```

Add Bento to `PATH` as the installer says, reopen your shell, and check:

```sh
bento --version
```

Quit the TUI before updating. Updates keep your projects, settings, credentials and Docker data.

```sh
bento update
bento
```

## Choose where agents run

| Mode | Board and history | Agents | Docker on your machine |
| --- | --- | --- | --- |
| Local | Your machine | Local Docker sandboxes | Required |
| Hosted | Bento at [usebento.ai](https://app.usebento.ai) | Server-managed sandboxes | Not required |
| Hosted board, local agents | Bento at [usebento.ai](https://app.usebento.ai) | Local Docker sandboxes | Required |

### Local board and local agents

Build the sandbox image, then run setup. Use `/usr/local/lib/bento/sandbox` if the installer put Bento there.

```sh
docker build -t bento-sandbox:dev "$HOME/.local/lib/bento/sandbox"
bento setup
```

Bento runs its API and PostgreSQL locally, with data in `~/.bento`. Rebuild the image when an update asks.

### Hosted board and server agents

Sign in, then open the hosted board:

```sh
bento login --server https://app.usebento.ai
bento setup --server https://app.usebento.ai
bento --server https://app.usebento.ai
```

Repositories and credentials are configured on the server; no Docker needed. Set `BENTO_URL=https://app.usebento.ai` to skip `--server`.

### Hosted board and local agents

Shared board at usebento.ai, agents on your checkouts:

```sh
bento --server https://app.usebento.ai --run-agents local
```

The TUI runs agents while open. To run queued work without it, start a runner:

```sh
bento runner --server https://app.usebento.ai
```

Work waits while the runner is offline. Automatic pull requests need server agents, since the server cannot reach local worktrees.

## Set up a project

Open Settings with `,` or `bento setup`. Tab moves between fields, Control+S saves, Escape cancels.

### Connect repositories

Under **Repositories**, connect a Git checkout on the machine that runs the agents. For each one, set:

- **Install dependencies:** runs once per sandbox. Sandboxes have Git and agent CLIs but no language runtime, so install it here. Leave blank to let the agent work it out.
- **Build and test:** how the agent validates changes, such as `pnpm test`.

### Configure agents

Under **Agents**, add an agent:

1. **Harness:** the coding tool, such as Claude Code, Codex or pi.
2. **Model:** what the harness runs.
3. **Skill:** standing instructions for every run: the stage's expected outcome, write-up and changes.

Save a key under **Model provider keys**, or for local agents share a CLI login under **Local agent sign-ins** (trusted repositories only). See [Coding agents](/docs/agents) for model formats and mid-run behavior.

### Build the pipeline

Under **Pipeline**, arrange the stages a card passes through. Each has an agent, requirements, and an optional pull request.

Start with manual gates: the card waits after each run so you can review, steer, approve or send it back. Switch a stage to automatic once its requirements are reliable. Editing an agent updates every stage that uses it. See [Pipelines](/docs/pipeline).

## Run the first card

1. Press `n`, enter a title and description, and create the card.
2. Select it in **Backlog** and press `a` to start the first stage.
3. Press Enter to watch the conversation. Focus the reply box to guide the agent while it works.
4. Review the output, artifacts, and diff. Return to the board and press `a` to approve.
5. Continue through the pipeline until the card reaches **Completed**.

A successful run does not approve a manual stage.

## Common shortcuts

| Key | Action |
| --- | --- |
| Arrow keys, `j` / `k` | Change stage or selected card |
| Enter | Open the selected card's conversation |
| `n` | Create a card |
| `s`, `x`, `c` | Start, stop, or message an agent |
| `a`, `R`, `r` | Approve, reject, or recheck requirements |
| `b` | Send back or reopen a card |
| `d`, `h` | Open the diff or card history |
| `v`, `u` | Open sessions or spend |
| `/` | Find a card |
| `p`, `,` | Switch projects or open Settings |
| `:`, Control+P, `?` | Open commands or help |
| `q` | Quit |

Export agents and pipelines to reuse a setup in another project:

```sh
bento agents export agents.yaml
bento pipeline export pipeline.yaml
bento agents import agents.yaml --project "Another project"
bento pipeline import pipeline.yaml --project "Another project"
```

Run `bento --help` to see every command and option.
