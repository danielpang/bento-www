# Handoff artifacts

To hand context from one coding agent to the next, have each stage write what it learned to a file in the repository and commit it. In Bento, the agent pipeline at [usebento.ai](/), every stage ends by committing a write-up to `docs/bento/<stage>.md` on the feature branch. The next stage's agent, whichever tool or model it runs, is told to read those files before it starts, so learnings travel with the code rather than through pasted chat.

That is the whole mechanism. The rest of this page covers what an artifact contains, where it lives, how the next agent finds it, how it relates to gates, and why it beats copying a transcript from Claude Code into Cursor.

## What a handoff artifact is

A handoff artifact is the stage write-up: a concise Markdown summary of what an agent did during one pipeline stage, what it decided, what it verified, and what it left open. The homepage examples are a product investigation, a UI/UX design with interaction states and acceptance criteria, and a QA report.

It is not the run transcript. The transcript is the full log of one run and stays on the card for people to inspect. The artifact is the part worth carrying forward, written by the agent for whoever works on the card next: another agent, or the person at the next gate.

What the write-up must contain is set by the stage's skill. Skills are standing instructions included in every prompt, and they define the expected outputs, artifacts, and code changes for a stage. See [Pipelines](/docs/pipeline#agents).

## Where it is written

Each card has one branch and one sandbox with git worktrees of the project's repositories. Stages pass context through committed files under `docs/bento/<stage>.md`, using the stage's slug as the file name, so a default pipeline produces files such as `docs/bento/design.md` and `docs/bento/implementation.md`.

When a stage's agent finishes, Bento's stage prompt asks it to write a concise summary of its work to that path and commit it together with its code changes. The write-up is a normal commit on the feature branch, with the same history and blame as everything else.

Projects with several repositories get one worktree per repository under a single feature workspace. The first repository is primary, and stage artifacts are written there. See [How Bento works](/docs/concepts#cards-sandboxes-and-worktrees).

## How the next agent reads it

When a card moves into the next stage, that stage's agent runs in the same sandbox on the same branch, so the earlier write-ups are already in its worktree. The stage prompt lists the artifact paths from every earlier stage and tells the agent to read the ones that exist before starting.

Because the handoff is a file in git, it does not depend on either agent's session format. One stage can run Claude Code and the next Cursor CLI, Codex CLI, or opencode; each supported agent runs as its own CLI in the sandbox and reads the same files. See [Coding agents](/docs/agents) for the supported tools and how each one takes credentials and mid-run messages.

Within a stage, follow-up messages resume the agent's CLI session when the tool exposes a session id. The artifact is for crossing the stage boundary, where the tool, the model, and the skill can all change.

## How gates relate

Every stage begins with a gate. New projects default to manual approval on all stages, so a person reviews the branch, the write-up included, before the next agent starts. Sending a card back stops the agent and waits for input; approving it starts the next stage with the committed write-ups in place. A gate can be made automatic once its requirements can decide: a successful run, a passing command, green GitHub checks, resolved review threads, or a judge agent.

A judge agent is a second agent on the same card, configured through its own skill and best given a different model from the working agent. It works from the same branch, write-up included, and an incomplete verdict holds the card and displays the reason. See [Gates](/docs/pipeline#gates).

## How this differs from pasting chat

Copying the end of one agent's conversation into another agent's chat window moves text, not context. The paste is whatever the person remembered to include, it lives in nobody's repository, and once the window closes it is gone.

| | Pasting a transcript | Handoff artifact |
| --- | --- | --- |
| Where it lives | One chat window | The feature branch, in git |
| Who wrote it | Whoever copied it | The agent that did the work, to the skill's brief |
| Reviewed | No | At the stage gate, alongside the code |
| Reaches the next agent | If someone pastes it | Named in the next stage's prompt |
| Works across tools | Depends on each tool's session format | Any agent that can read a file |
| History | None | Every version, in the commit history |

## Artifacts and pull requests

Stage write-ups exist for downstream stages, not for reviewers of the pull request. Before publication, Bento removes the `docs/bento/` files from the branch tip, so the PR diff contains code changes only. The files remain in git history. If you prefer to keep them in the pull request, turn that on under **Settings, GitHub**. See [Pull requests](/docs/pull-requests#stage-artifacts-in-pull-requests).

## Writing a skill that produces a good handoff

The stage prompt asks for a summary; the skill decides what a useful one contains. Name the sections you want the next stage to be able to rely on. A skill for an engineering stage might end with:

```text
In your stage write-up, record the approach you chose and the alternatives
you rejected, the risks and anything that cannot be undone, and the files
the implementation stage should start from. Ask for any decision you need
rather than guessing at it.
```

Skills are edited under **Agents**, or exported and imported as YAML. See [The agents file](/docs/pipeline#the-agents-file).

## Getting started

Handoff artifacts are part of every plan, including Free, which comes with 3 members and 5 agent hours a month. [Create an account](https://app.usebento.ai/) to set up a pipeline, or [compare plans on the pricing page](/pricing). Bento can also be [self-hosted](/docs/web-app) under its source license.
