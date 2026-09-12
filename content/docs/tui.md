# TUI

Run Bento's Kanban board in your terminal, with coding agents working in isolated sandboxes on your machine or on Bento's hosted server.

## Install the CLI

You need Node.js 22.19 or newer, `curl`, and `tar`. Release builds support macOS and glibc Linux on x64 and ARM64. On Windows, run Bento inside [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install). Local agents also require Docker to be running.

Install the latest release:

```sh
curl -fsSL https://usebento.ai/install.sh | sh
```

Follow the installer's instruction to add Bento to `PATH`, reopen your shell, and verify the installation:

```sh
bento --version
```

Quit the TUI before updating. Updates keep your projects, settings, credentials, and local Docker data.

```sh
bento update
bento
```

## Choose where agents run

The board and the agents do not have to run in the same place.

| Mode | Board and history | Agents | Docker on your machine |
| --- | --- | --- | --- |
| Local | Your machine | Local Docker sandboxes | Required |
| Hosted | Bento at [usebento.ai](https://app.usebento.ai) | Server-managed sandboxes | Not required |
| Hosted board, local agents | Bento at [usebento.ai](https://app.usebento.ai) | Local Docker sandboxes | Required |

### Local board and local agents

Build the bundled sandbox image, then open setup. The installer prints its install directory. This example uses the home-directory location; replace it with `/usr/local/lib/bento/sandbox` if that is where Bento was installed.

```sh
docker build -t bento-sandbox:dev "$HOME/.local/lib/bento/sandbox"
bento setup
```

Bento starts its API and PostgreSQL locally. Projects, settings, and worktrees live in `~/.bento`. Run `bento` to return to the board. Rebuild the sandbox image when an update prompts you to do so.

### Hosted board and server agents

Sign in through the browser, then open the hosted board:

```sh
bento login --server https://app.usebento.ai
bento setup --server https://app.usebento.ai
bento --server https://app.usebento.ai
```

Configure repository access and agent credentials on the hosted server. Your computer does not need Docker. Set `BENTO_URL=https://app.usebento.ai` in your shell environment if you do not want to repeat `--server`.

### Hosted board and local agents

Use the shared board and history at usebento.ai while agents work against checkouts on your machine:

```sh
bento --server https://app.usebento.ai --run-agents local
```

The TUI runs agents while it is open. To process queued work without opening the board, start a runner:

```sh
bento runner --server https://app.usebento.ai
```

Work waits while your runner is offline. Because the hosted server cannot access local worktrees, automatic GitHub pull request publication requires server-side agents.

## Set up a project

Open Settings with `,`, or run `bento setup`. Forms use Tab to move between fields, Control+S to save, and Escape to cancel.

### Connect repositories

Under **Repositories**, connect a Git checkout. The path must exist on the machine that runs the agents: your computer for local agents, or the hosted server for hosted agents.

For each repository, configure:

- **Install dependencies:** prepares the runtime, tools, and dependencies once per sandbox. Leave it blank to let the agent inspect the repository and prepare it.
- **Build and test:** tells the agent how to validate its changes, such as `pnpm build` or `pnpm test`.

Sandboxes include Git and agent CLIs, but no project language runtime. Put runtime and dependency installation in the first command, and validation in the second.

### Configure agents

Under **Agents**, add an agent and choose three things:

1. **Harness:** the coding tool, such as Claude Code, Codex CLI, Cursor CLI, opencode, pi, Poolside, DeepSeek Harness, or Antigravity CLI.
2. **Model:** the model that the harness runs.
3. **Skill:** standing instructions included every time the agent starts. Describe the stage's expected outcome, write-up, artifacts, and code changes here.

Save a provider API key under **Model provider keys**. For local agents, **Local agent sign-ins** can instead share a supported CLI login from your machine. Only share local credentials with repositories you trust.

See [Coding agents](/docs/agents) for harness-specific credentials, model formats, and mid-run messaging behavior.

### Build the pipeline

Under **Pipeline**, arrange the stages that a card passes through. Each stage has an assigned agent, instructions, advancement requirements, and an optional automatic pull request setting.

Start with manual gates. A card waits after each agent finishes so you can review the output, steer the agent, approve the stage, or send it back. When the stage has reliable requirements, switch it to automatic advancement. All listed requirements must pass before the card moves forward.

Typical stages include product investigation, design, requirements, implementation, code review, and quality engineering. Agents are reusable: editing an agent updates every stage that uses it.

See [Pipelines](/docs/pipeline) for command requirements, judge agents, GitHub checks, automatic gates, and pipeline YAML.

## Run the first card

1. Press `n`, enter a title and description, and create the card.
2. Select it in **Backlog** and press `a` to start the first stage.
3. Press Enter to watch the conversation. Focus the reply box to guide the agent while it works.
4. Review the output, artifacts, and diff. Return to the board and press `a` to approve.
5. Continue through the pipeline until the card reaches **Completed**.

A successful run does not approve a manual stage. Automatic stages advance only after every requirement passes.

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
