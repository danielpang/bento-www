# How do I pass context to the next agent?

Commit a handoff artifact: a stage write-up the agent saves in the repository before it finishes, not a chat dump pasted into the next tool. In Bento, the agent pipeline at [usebento.ai](/), every stage ends by committing `docs/bento/<stage>.md` on the feature branch, and the next stage's agent is told to read those files before it starts, whatever tool or model it runs.

## The path pattern

Stages pass context through committed files under `docs/bento/<stage>.md`, named after the stage's slug. The default six stage pipeline gives one file per stage:

```text
docs/bento/product-investigation.md
docs/bento/design.md
docs/bento/engineering-requirements.md
docs/bento/implementation.md
docs/bento/code-review.md
docs/bento/quality-engineering.md
```

Rename a stage and the path follows. Each card has one branch and one sandbox; with several repositories, the first is primary and holds the write-ups. See [cards, sandboxes and worktrees](/docs/concepts#cards-sandboxes-and-worktrees).

## The restart-from-files test

A stage boundary is a fresh start. The next agent inherits no chat session, only the stage prompt, which lists the earlier artifact paths and says to read the ones that exist, and the files on the branch. So the test for a write-up is simple: could an agent starting from the files alone continue the work? Anything that was only said in a chat window belongs in the file.

A lost session within a stage is different: Bento restarts the run with the stage prompt and a compacted transcript. Crossing a stage relies on the committed files, so the tool, model, and skill can all change.

## What the artifact is

The stage write-up: a concise Markdown summary of what the agent did, decided, verified, and left open. It is not the run transcript, which stays on the card as the full log. The stage's skill decides what the write-up must contain; skills are standing instructions in every prompt that define expected outputs, artifacts, and code changes. See [agents and skills](/docs/pipeline#agents).

## How the next agent reads it

The next stage's agent runs in the same sandbox on the same branch, so the earlier write-ups are already in its worktree and its prompt names them. Because the handoff is a file in git, one stage can run Claude Code and the next Cursor CLI, Codex CLI, or opencode. See [Coding agents](/docs/agents).

## How gates relate

Every stage begins with a gate. New projects default to manual approval, so a person reviews the branch, write-up included, before the next agent starts; sending the card back stops the agent and waits for input. A gate can be made automatic once its requirements can decide, including a judge agent: a second agent on the same card, best on a different model, that works from the same branch. See [Gates](/docs/pipeline#gates).

## Not a chat dump

Pasting the end of one conversation into another tool moves text, not context.

| | Pasting a transcript | Handoff artifact |
| --- | --- | --- |
| Where it lives | One chat window | The feature branch, in git |
| Reviewed | No | At the stage gate, with the code |
| Reaches the next agent | If someone pastes it | Named in the next stage's prompt |
| Works across tools | Depends on the session format | Any agent that can read a file |
| History | None | Every version, in git |

## Artifacts and pull requests

Before publishing, Bento removes `docs/bento/` from the branch tip, so the PR diff contains code only; the files remain in git history. Keep them in the PR under **Settings, GitHub**. See [stage artifacts in pull requests](/docs/pull-requests#stage-artifacts-in-pull-requests).

## Writing a skill that produces a good handoff

The prompt asks for a summary; the skill decides what a useful one contains. An engineering stage's skill might end with:

```text
In your stage write-up, record the approach you chose and the alternatives
you rejected, the risks, and the files the implementation stage should
start from. Ask for any decision you need rather than guessing at it.
```

Edit skills under **Agents** or as YAML in [the agents file](/docs/pipeline#the-agents-file).

## Go deeper

- [How Bento works](/docs/concepts): cards, sandboxes, and worktrees.
- [Pipelines](/docs/pipeline): stages, gates, judge agents, and skills.
- [Coding agents](/docs/agents): supported tools and credentials.
- [Pull requests](/docs/pull-requests): publishing and `docs/bento/` cleanup.
- [Web console](/docs/web-app): running or self-hosting Bento.

## Getting started

Every plan includes handoff artifacts; Free comes with 3 members and 5 agent hours a month. [Create an account](https://app.usebento.ai/) or [compare plans on the pricing page](/pricing).
