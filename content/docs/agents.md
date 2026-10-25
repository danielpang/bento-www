# Supported coding agents

Each stage runs one agent: a harness, a model and a skill.

| Tool | Model format | Personal subscription | Steer | Interrupt | Questions | Cost |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code | `claude-sonnet-5` | Claude | Queued: runs as one more turn after the current one | Yes | Yes: one or several choices, or your own words | Yes |
| pi | `anthropic/claude-sonnet-5` | Claude or ChatGPT | Yes, after the current tool call | Yes | Yes: one or several choices, or your own words | Yes |
| Codex CLI | `gpt-5-codex`, `openai/gpt-5-mini`, or `vercel/moonshotai/kimi-k3` | ChatGPT | Yes, at the next model call | Yes | Yes: one choice, or your own words | Tokens only |
| opencode | `anthropic/claude-sonnet-5` | No | Yes, at the next model call | Yes | No | Tokens only |
| Cursor CLI | `claude-sonnet-5`, `composer-2.5`, `grok-4.6` | No | No: next run (session resume) | No | No | No |
| Antigravity CLI | `gemini-3.1-pro-high` | No | No: next run (conversation resume) | No | No | No |
| Muse Code | `muse-spark-1.3` | No | No: next run (session resume) | No | No | No |
| fx | `moonshotai/kimi-k3` | No | No: next run (session resume) | No | No | No |
| Poolside (pool) | `poolside/laguna-s-2.1` | No | No: next run (new session) | No | No | No |
| DeepSeek Harness (dsh, preview) | `deepseek-v4-pro` | No | No: next run (new session) | No | No | No |

- **Personal subscription**: account connections through **Agents → Your personal subscriptions** in local and hosted Bento. Applies to matching models on stage runs you start; see [setup and limits](#personal-account-connections). Other local login-sharing options are described in the per-tool notes.
- **Steer**: what happens to a message you send while the agent works. Yes means it reaches the turn already running. Queued means it waits in the same session for the current turn to end. "Next run" means it waits for the run to end and starts a new one, resuming the conversation where the tool can.
- **Interrupt**: Stop ends only the current turn, and the agent waits for your next message in the same session. Where it is No, Stop ends the run.
- **Questions**: the agent can ask you a question on the card and wait for your answer.
- **Cost**: whether the tool reports a price for the run. "Tokens only" means it reports token counts and no price.
- Interrupt and questions apply to a card's stage runs (see [Talking to a working agent](/docs/agents#talking-to-a-working-agent)). A Codex profile with `codex exec` flags, or an opencode profile with extra arguments, runs the one-shot command: no steering, interrupt or questions, messages wait for the next run, and opencode reports no tokens.
- Credentials for each tool are set under **Agents** in the web console.

Keys are stored encrypted, per organization in multi mode. Add them in the Web UI or with `bento setup`. In multi mode, and in local mode with the Docker sandbox, a sandbox gets a proxy token in place of most keys, and the model proxy adds the key on Bento's side (see [Security](/docs/security#model-keys-stay-encrypted-in-bento)).

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

## Personal account connections

Connect your own Claude or ChatGPT subscription under **Agents → Your personal subscriptions**. Setup is the same in local and hosted Bento. On hosted Bento, sign in with your own Bento user account before connecting. Each person connects separately; companies and teams must not share subscription logins.

| Connection | Coding agents | Matching models |
| --- | --- | --- |
| Claude | Claude Code, pi | Bare Claude model IDs in Claude Code; `anthropic/` models in pi |
| ChatGPT | Codex, pi | Bare OpenAI model IDs in Codex; `openai/` or `openai-codex/` models in pi that are available through Codex |

### Connect Claude

1. Open **Agents → Your personal subscriptions** and click **Connect Claude**.
2. Open the **Claude sign in** link, sign in to your own Claude account, and authorize the connection.
3. Copy the complete authorization code, including the `#` and the text after it (`code#state`).
4. Paste it into **Paste the complete authorization code** in Bento and click **Finish connection**.
5. Wait for Claude to show **Connected to your account**.

This one connection supports both Claude Code and pi with Anthropic models.

### Connect ChatGPT

1. Open **Agents → Your personal subscriptions** and click **Connect ChatGPT**.
2. Open the **ChatGPT sign in** link and sign in to your own ChatGPT account.
3. Enter the device code shown in Bento and approve the connection. If the provider refuses device-code login, enable it in your account's security settings and start again.
4. Keep Bento open while it checks for approval. When complete, ChatGPT shows **Connected to your account**; there is no authorization code to paste back into Bento.

This one connection supports both Codex and pi with models available through Codex.

### Start a run

Choose a matching agent and model, then explicitly start a card's stage run or send a follow-up message. A connected subscription takes priority for matching models, so you do not need a separate provider API key for those runs. In Codex, a provider-prefixed model such as `openai/gpt-5-mini` selects OpenRouter, not your ChatGPT subscription.

Custom provider endpoints keep using their API keys. Background stages, judges, conflict resolution, swarms, and remote runners keep their existing credentials. They do not borrow your subscription or the project owner's login.

Your connection belongs to you, even inside a team. Other members, including owners and admins, cannot list, change, or use it. They cannot steer, answer questions on, or change your card while your personal subscription run is active. Follow-ups from different people are handled in separate runs.

### Reconnect or disconnect

Return to **Agents → Your personal subscriptions** and click **Reconnect** if Bento asks you to sign in again. For an expired device code, start a new connection. For an invalid Claude authorization code, paste the complete `code#state` from the current login attempt. **Cancel connection** cancels a pending login.

Click **Disconnect** to stop using a connection. Its next model request is refused; start a new run to use your configured API credentials. A running subscription task never silently switches to paid API credentials. Reconnecting creates a new connection, so start a new run after reconnecting rather than trying to revive an old task. Automatic retries retain the original user and connection.

Bento encrypts your provider tokens and refreshes them on the server. Agents receive only a temporary Bento run token through the model proxy. Provider subscription limits and Bento hosting charges still apply; a reported subscription model cost is a notional list price, not an API charge.

## Claude Code on a subscription

Use [Personal account connections](#personal-account-connections) for browser login in local or hosted Bento. The older `setup-token` option below is local mode only. Hosted organizations cannot save a shared Claude subscription token.

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

`provider/id` model ids. Use a [personal Claude or ChatGPT connection](#personal-account-connections) for eligible runs, or the key for the model's provider (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY` or `DEEPSEEK_API_KEY`).

### Codex CLI

Bare ids (`gpt-5-codex`) or provider prefixed ids (`openai/gpt-5-mini`, `vercel/moonshotai/kimi-k3`). Bare IDs can use your [personal ChatGPT connection](#personal-account-connections) for eligible runs, or `OPENAI_API_KEY`. Provider-prefixed OpenRouter and Vercel models use their respective API keys.

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
