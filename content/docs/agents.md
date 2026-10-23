# Supported coding agents

Each stage runs one agent: a harness, a model and a skill.

| Tool | Model format | Steer | Interrupt | Questions | Cost |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `claude-sonnet-5` | Queued: runs as one more turn after the current one | Yes | Yes: one or several choices, or your own words | Yes |
| pi | `anthropic/claude-sonnet-5` | Yes, after the current tool call | Yes | Yes: one or several choices, or your own words | Yes |
| Codex CLI | `gpt-5-codex`, `openai/gpt-5-mini`, or `vercel/moonshotai/kimi-k3` | Yes, at the next model call | Yes | Yes: one choice, or your own words | Tokens only |
| opencode | `anthropic/claude-sonnet-5` | Yes, at the next model call | Yes | No | Tokens only |
| Cursor CLI | `claude-sonnet-5`, `composer-2.5`, `grok-4.6` | No: next run (session resume) | No | No | No |
| Antigravity CLI | `gemini-3.1-pro-high` | No: next run (conversation resume) | No | No | No |
| Muse Code | `muse-spark-1.3` | No: next run (session resume) | No | No | No |
| fx | `moonshotai/kimi-k3` | No: next run (session resume) | No | No | No |
| Poolside (pool) | `poolside/laguna-s-2.1` | No: next run (new session) | No | No | No |
| DeepSeek Harness (dsh, preview) | `deepseek-v4-pro` | No: next run (new session) | No | No | No |

- **Steer**: what happens to a message you send while the agent works. Yes means it reaches the turn already running. Queued means it waits in the same session for the current turn to end. "Next run" means it waits for the run to end and starts a new one, resuming the conversation where the tool can.
- **Interrupt**: Stop ends only the current turn, and the agent waits for your next message in the same session. Where it is No, Stop ends the run.
- **Questions**: the agent can ask you a question on the card and wait for your answer.
- **Cost**: whether the tool reports a price for the run. "Tokens only" means it reports token counts and no price.
- Interrupt and questions apply to a card's stage runs (see [Talking to a working agent](/docs/agents#talking-to-a-working-agent)). A Codex profile with `codex exec` flags, or an opencode profile with extra arguments, runs the one-shot command: no steering, interrupt or questions, messages wait for the next run, and opencode reports no tokens.
- Credentials for each tool are set under **Agents** in the web console.

Keys are stored encrypted, per organization in multi mode. Add them in the Web UI or with `bento setup`. In multi mode, a sandbox gets a proxy token in place of most keys, and the model proxy adds the key on Bento's side (see [Security](/docs/security#model-keys-stay-encrypted-in-bento)).

**OpenRouter:** for Claude Code or Codex, save the OpenRouter key and set `ANTHROPIC_BASE_URL` or `OPENAI_BASE_URL` to `https://openrouter.ai/api/v1`.

**DeepSeek:** use pi or opencode with `DEEPSEEK_API_KEY` or `openrouter/deepseek/...` for streamed runs. DeepSeek Harness (`dsh`) is a preview.

Warm sandboxes reinstall pi below 0.70.1, opencode below 1.14.24, or dsh when its version does not match the pin.

Export and import agents as YAML from **Agents**, **Settings, Config**, or `bento agents export` / `import`. See [the agents file](/docs/pipeline#the-agents-file).

## Talking to a working agent

### Messages

A message sent while a live agent works:

- **Claude Code:** queued, then runs as one more turn. Several messages become one turn.
- **Codex:** cancels the model call in flight. The next call includes the message.
- **opencode:** read at the next model call, in the same turn.
- **pi:** delivered after the current tool call.

A message to a live agent between turns starts a new turn. Other agents get the message when the run ends: Cursor, Antigravity, Muse Code and fx resume the session, while pool and dsh start fresh with the stage prompt and a compacted transcript. Bento does the same when a session is lost.

### Stop

On Claude Code, Codex, opencode and pi, **Stop** ends the current turn, like Escape in a terminal. The agent waits for your next message in the same session. Stop works from the moment a run starts and is disabled while the agent waits.

The transcript shows "turn stopped" (not a failure), then:

> If no follow up message is sent after 90s the agent run will end. Sending a follow up message will restart the stage.

If you send nothing within the stage's idle window (90 seconds by default), the run closes as stopped, not failed, and the card stays in its stage. Cost, tokens, artifacts, pushed commits and the sandbox are kept. The transcript shows:

> Session paused. Your next message will resume it.

Stop ends the run on judge, conflict resolution and swarm runs, and on agents without interrupt. Right after a server deploy, a Codex or pi turn already in progress cannot be interrupted: Stop ends that run but keeps the session.

### Questions

Claude Code, Codex and pi can ask questions on the card (pi through an `ask_user` tool Bento installs). The agent waits for your answers.

Questions appear above the composer, one at a time. A single choice answer moves on by itself. Otherwise press **Next** or Enter. **Back**, or a question's chip, returns to an earlier answer. With several questions, a review step lists every answer before **Send**.

A question disappears once the agent stops waiting for it. Unattended runs (swarms, judges, conflict resolution) decline questions, so the agent decides and says what it chose.

## Claude Code on a subscription

Local mode only. Not available on hosted Bento at [usebento.ai](/).

```bash
claude setup-token
```

Save the token under **Agents, Claude subscription**, in `bento setup`, or as `CLAUDE_CODE_OAUTH_TOKEN=` in `.env` (docker compose). The Web UI value overrides `.env`.

With a token saved, `ANTHROPIC_API_KEY` is not sent. `ANTHROPIC_BASE_URL` forces API key use, since tokens only work at Anthropic's endpoint.

Do not use macOS Keychain login on servers: its tokens rotate and are unavailable in containers. On "OAuth access token has been revoked", run `claude setup-token` again and save the new token.

## Per tool notes

### Claude Code

Bare model ids (`claude-sonnet-5`, `claude-opus-5`).

### pi

`provider/id` model ids. Needs the key for the model's provider (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY` or `DEEPSEEK_API_KEY`).

### Codex CLI

Bare ids (`gpt-5-codex`) or provider prefixed ids (`openai/gpt-5-mini`, `vercel/moonshotai/kimi-k3`). `OPENAI_API_KEY`, or OpenRouter via `OPENAI_BASE_URL`.

### Cursor CLI

Model ids per your Cursor plan; unlisted ids can be typed in. `CURSOR_API_KEY`. Runs headless.

### opencode

`provider/id` model ids, including `openrouter/`. Same keys as pi.

### Poolside (pool)

`poolside/laguna-s-2.1` and other Laguna ids. `POOLSIDE_API_KEY`. Bento sets the model through `POOLSIDE_STANDALONE_MODEL`; override the endpoint locally with `POOLSIDE_STANDALONE_BASE_URL`. Alternative: pi or opencode with `openrouter/poolside/laguna-s-2.1`.

### DeepSeek Harness (dsh)

Preview, pinned to `@deepseek-ai/dsh@0.1.1-rc.2`. Bare ids (`deepseek-v4-pro`). `DEEPSEEK_API_KEY`, optional `DEEPSEEK_BASE_URL`. Prints only the final message, so use **Changes** to see file edits.

### Antigravity CLI

Google's `agy`, run headless. Model slugs name the tier and reasoning effort (`gemini-3.1-pro-high`, `gemini-3.6-flash-medium`); unlisted slugs can be typed in.

Uses `GEMINI_API_KEY`, optionally with `GOOGLE_GEMINI_BASE_URL`, so only Gemini models are available. The Claude and GPT models need a signed in Google account, which local mode can share from this machine (**Agents**, "Use this machine's logins"). Sharing a login carries the usual risk.

Antigravity bills against a plan's quota, not per run. MCP servers are written to `~/.gemini/config/mcp_config.json` before every run.
