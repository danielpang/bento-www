# Supported coding agents

Each stage runs one agent: harness, model, and skill. Tools differ in authentication, mid-run messaging, interrupts, questions, and cost reporting.

| Tool | Model format | Credential | Mid-run messaging | Reports cost |
| --- | --- | --- | --- | --- |
| Claude Code | `claude-sonnet-5` | `ANTHROPIC_API_KEY` or subscription token | Queued as one more turn | Yes |
| pi | `anthropic/claude-sonnet-5` | Provider key for selected model | Steers the running turn | Yes |
| Codex CLI | `gpt-5-codex` | `OPENAI_API_KEY` | Steers the running turn | No |
| Cursor CLI | `claude-sonnet-5`, `composer-2.5`, `grok-4.6` | `CURSOR_API_KEY` | Between runs (session resume) | No |
| opencode | `anthropic/claude-sonnet-5` | Provider key for selected model | Joins the running turn | No |
| Poolside (pool) | `poolside/laguna-s-2.1` | `POOLSIDE_API_KEY` | Between runs (new run, no session id) | No |
| DeepSeek Harness (dsh, preview) | `deepseek-v4-pro` | `DEEPSEEK_API_KEY` | Between runs (new run, no session id) | No |
| Antigravity CLI | `gemini-3.1-pro-high` | `GEMINI_API_KEY` | Between runs (conversation resume) | No |

Keys are stored encrypted (per organization in multi mode; local scope in local mode) via the Web UI or `bento setup`.

OpenRouter routing for Claude Code or Codex: save the OpenRouter key and set `ANTHROPIC_BASE_URL` or `OPENAI_BASE_URL` to `https://openrouter.ai/api/v1`.

**DeepSeek:** use pi or opencode for streamed runs with `DEEPSEEK_API_KEY` or `openrouter/deepseek/...`. DeepSeek Harness (`dsh`) is preview-only (see below). Warm sandboxes reinstall pi below 0.70.1, opencode below 1.14.24, or dsh when `--version` does not match the pin.

Export/import agents as YAML from **Agents**, **Settings, Config**, or `bento agents export` / `import`. See [the agents file](/docs/pipeline#the-agents-file).

## Talking to a working agent

The card composer accepts messages while an agent works. Claude Code, Codex, opencode and pi run live sessions, so a message reaches the agent during its turn. Live messages, Stop and agent questions are available to every signed-in user, with nothing to turn on.

| Feature | Claude Code | Codex | opencode | pi | Cursor | Others |
| --- | --- | --- | --- | --- | --- | --- |
| Message while working | Yes (queued as one more turn) | Yes (steers) | Yes (joins the turn) | Yes (steers) | No, starts a new run after | No |
| Stop interrupts the turn | Yes | Yes | Yes | Yes | No, ends the run | No, ends the run |
| Answer questions on the card | Yes | Yes | No | Yes | No | No |
| Question types | Single, multiple, own words | Single, own words | | Single, multiple, own words | | |

### Messages sent mid-turn

How each live agent handles a message sent while it works:

- **Claude Code:** the message is queued, then runs as one more turn after the current turn ends. Several messages sent during one turn become a single extra turn.
- **Codex:** the message steers the running turn. Codex stops the model call in flight, and the next call includes the message.
- **opencode:** the message joins the same turn and is read at the next model call.
- **pi:** the message steers the running turn.

A message to a live agent that is waiting between turns starts a new turn.

Agents without live sessions (Cursor, Antigravity, dsh, pool and the other agents) take no input mid-run. A message waits until the run ends, then starts a new run that resumes the conversation where the tool supports it. Cursor and Antigravity resume their session. pool and dsh start fresh with the stage prompt and a compacted transcript.

A Codex or opencode agent with extra command line arguments that only fit the one-shot command keeps the old mode: no live messages, no interrupt and no questions. Its messages wait for the run to end, and the next run resumes the session.

If the session is unavailable (sandbox recreated or CLI session lost), Bento starts a new run with the same instructions and compacted transcript.

### Stopping a turn

On a card's stage runs, **Stop** interrupts Claude Code, Codex, opencode and pi instead of ending the run. The composer has one Stop button:

- **While the agent works,** Stop ends its current turn, like pressing Escape in a terminal. The agent does no more work and waits for your next message, which continues the same session.
- **While the agent waits,** Stop is disabled: there is nothing to stop.

Stop works from the moment a run starts, including while opencode is still starting up.

The transcript marks the stopped turn as "turn stopped". This is a neutral marker, not a failure. It is followed by:

> If no follow up message is sent after 90s the agent run will end. Sending a follow up message will restart the stage.

If you send nothing within the stage's idle window (90 seconds by default), the run closes as "stopped", not "failed", and the card stays in its stage. The transcript shows:

> Session paused. Your next message will resume it.

A stopped run keeps its work:

- Work done before the stop is kept. Cost and tokens are recorded, artifacts are saved, and commits are pushed if the stage creates a pull request.
- The sandbox is kept. Your next message continues the same session in a new run.

Stop still ends the run on:

- judge runs, conflict resolution (rebase) runs and swarm runs;
- agents that cannot be interrupted (Cursor and the other agents without live sessions). Pending messages remain queued on the card.

Right after a server deploy, a Codex or pi turn that was already running cannot be interrupted. Stop ends that run instead and keeps the session, so your next message resumes it. Later turns can be interrupted as usual.

### Questions from the agent

On a card's stage runs, Claude Code, Codex and pi can ask you questions. The agent waits for your answers and continues with them.

- **Claude Code:** single choice, multiple choice, or your own words.
- **Codex:** single choice or your own words.
- **pi:** single choice, multiple choice, or your own words, through an `ask_user` tool Bento installs for pi.

opencode cannot ask questions (its server mode drops them), and neither can the agents without live sessions.

Questions appear on a card above the composer, one at a time, as in the Claude Code mobile app:

- Tapping an option of a single choice question moves to the next question by itself.
- For multiple choice, or an answer typed in your own words, press **Next** or Enter to move on.
- **Back**, or a question's chip at the top, returns to an earlier answer so you can change it. Your other answers are kept.
- With several questions, the last step reviews every answer, each with **Change**, before you send.
- A single question has no chips and no review step: pick an answer, then **Send**.

A question disappears when the agent no longer waits for it: the agent withdraws it, you stop the turn, the turn ends, or the run ends.

Runs nobody is watching (swarms, judges, conflict resolution) never offer questions. If an agent asks one anyway, Bento declines it, so the agent makes its own choice and says which.

## Claude Code on a subscription

Local mode only. Not supported on hosted Bento at [usebento.ai](/).

```bash
claude setup-token
```

Save the token in:

- **Web UI:** Agents → Claude subscription
- `bento setup`
- `.env` as `CLAUDE_CODE_OAUTH_TOKEN=` (docker compose). The Web UI value overrides `.env`.

When a subscription token is present, `ANTHROPIC_API_KEY` is not sent. Claude Code prefers API keys when both are available. `ANTHROPIC_BASE_URL` forces API key use (tokens are valid only at Anthropic's endpoint).

Do not use macOS Keychain login for server deployments. Keychain tokens rotate frequently and are unavailable in containers. Use `setup-token`.

On "OAuth access token has been revoked", regenerate with `claude setup-token` and update the stored token.

## Per tool notes

### Claude Code

Bare model ids (`claude-sonnet-5`, `claude-opus-5`). Reports cost. Live session: messages sent mid-turn run as one more turn, **Stop** interrupts the turn, and the agent can ask questions on the card.

### pi

Provider-agnostic (`provider/id` format). Keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY` as required by model. Reports cost.

Live session: messages steer the running turn, and **Stop** interrupts the turn. pi asks questions on the card through an `ask_user` tool that Bento installs. A message to a pi agent that has finished its turn now starts a new turn. It used to start nothing until the run limit.

### Codex CLI

Bare model ids. `OPENAI_API_KEY` or OpenRouter via `OPENAI_BASE_URL`. Does not report cost.

Live session: messages steer the running turn, **Stop** interrupts the turn, and the agent can ask single choice or free text questions on the card.

### Cursor CLI

Bare model ids per Cursor plan. Single `CURSOR_API_KEY`. Unlisted model ids may be entered manually. Headless mode accepts no mid-run input: a message waits until the run ends, then the next run resumes the chat. **Stop** ends the run. Does not report cost.

### opencode

`provider/id` format including `openrouter/`. Same provider keys as pi. Does not report cost.

Live session: messages join the running turn and are read at the next model call. **Stop** interrupts the turn, even while opencode is still starting up. opencode cannot ask questions on the card, because its server mode drops them.

### Poolside (pool)

Vendor-prefixed ids (`poolside/laguna-s-2.1`). `POOLSIDE_API_KEY`. Additional Laguna ids may be typed manually.

`pool exec` has no `--model` flag. Bento sets `POOLSIDE_STANDALONE_MODEL` and the Poolside Platform base URL. Override with `POOLSIDE_STANDALONE_BASE_URL` locally.

OpenRouter alternative: pi or opencode with `openrouter/poolside/laguna-s-2.1`. Does not report cost.

### DeepSeek Harness (dsh)

Preview. Pinned `@deepseek-ai/dsh@0.1.1-rc.2`. Bare model id (e.g. `deepseek-v4-pro`). `DEEPSEEK_API_KEY`; optional `DEEPSEEK_BASE_URL`.

Outputs final message only (no streamed tool/thinking events). No session id. Use **Changes** for file-level results.

### Antigravity CLI

Google's `agy`, run headlessly (`agy -p ... --output-format stream-json`). Bare Antigravity model slugs, which name the model tier and its reasoning effort together: `gemini-3.1-pro-high`, `gemini-3.6-flash-medium`. Unlisted slugs may be typed manually.

Authentication is `GEMINI_API_KEY`. Antigravity normally signs in with a Google account, which no sandbox can do, so Bento's sandboxes carry `{"modelProvider": "gemini"}` in `~/.gemini/antigravity-cli/settings.json` and the CLI runs against the key. Optional `GOOGLE_GEMINI_BASE_URL` points it at a Gemini compatible endpoint. Only Gemini models are served on this route: the Claude and GPT models Antigravity offers need a signed-in account, which local mode can supply by sharing this machine's `~/.gemini` (Agents, "Use this machine's logins"), with the same risk that sharing any login carries.

Runs resume by conversation id (`--conversation`), so a follow-up continues the same conversation. Headless mode accepts no mid-run input, and **Stop** ends the run. Does not report cost: Antigravity bills against a plan's quota rather than per run.

MCP servers attach through `~/.gemini/config/mcp_config.json`, which Bento rewrites before every run.
