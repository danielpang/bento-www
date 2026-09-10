# How do I pass context to the next agent?

Commit a handoff artifact: a stage write-up the agent saves in the repository before it finishes, not a chat dump pasted into the next tool. In Bento, the agent pipeline at [usebento.ai](/), every stage ends by committing `docs/bento/<stage>.md` on the feature branch, and the next stage's agent is told to read those files before it starts, whatever tool or model it runs.

This page is the short route in. The mechanics are documented in the guides it links to: [How Bento works](/docs/concepts), [Pipelines](/docs/pipeline), [Coding agents](/docs/agents), and [Pull requests](/docs/pull-requests).

## The path pattern

Stages pass context through committed files under `docs/bento/<stage>.md`, named after the stage's slug. In the default six stage pipeline that gives one file per stage, each written by the agent that ran it:

```text
docs/bento/product-investigation.md
docs/bento/design.md
docs/bento/engineering-requirements.md
docs/bento/implementation.md
docs/bento/code-review.md
docs/bento/quality-engineering.md
```

Rename a stage and the path follows its slug. Each card has one branch and one sandbox with git worktrees of the project's repositories; in a project with several repositories the first one is primary and the write-ups are written there. See [cards, sandboxes and worktrees](/docs/concepts#cards-sandboxes-and-worktrees).

## The restart-from-files test

A stage boundary is a fresh start. The next stage's agent does not inherit a chat session from the stage before it. It gets the stage prompt, which lists the earlier stages' artifact paths and says to read the ones that exist before starting, and the files on the branch. Nothing else crosses over.

That makes the test for a good write-up simple: could an agent that starts from the files alone continue the work? If the answer depends on something that was only ever said in a chat window, it belongs in the write-up. The next agent will not have it otherwise, and neither will the person reviewing the card at the gate.

This is different from a lost session within a stage. When a tool's session is unavailable, Bento starts a new run with the stage prompt and a compacted transcript. Crossing to the next stage relies on the committed files, so that the tool, the model, and the skill can all change.

## What a handoff artifact is

A handoff artifact is the stage write-up: a concise Markdown summary of what an agent did during one pipeline stage, what it decided, what it verified, and what it left open. The homepage examples are a product investigation, a UI/UX design with interaction states and acceptance criteria, and a QA report.

It is not the run transcript. The transcript is the full log of one run and stays on the card for people to inspect. The artifact is the part worth carrying forward, written by the agent for whoever works on the card next: another agent, or the person at the next gate.

What the write-up must contain is set by the stage's skill. Skills are standing instructions included in every prompt, and they define the expected outputs, artifacts, and code changes for a stage. See [agents and skills](/docs/pipeline#agents).

## How the next agent reads it

When a card moves into the next stage, that stage's agent runs in the same sandbox on the same branch, so the earlier write-ups are already in its worktree. Bento's stage prompt asks each agent to write a concise summary of its work to its own `docs/bento/<stage>.md` and commit it together with its code changes, and tells the next agent which of those files to read.

Because the handoff is a file in git, it does not depend on either agent's session format. One stage can run Claude Code and the next Cursor CLI, Codex CLI, or opencode; each supported agent runs as its own CLI in the sandbox and reads the same files. See [Coding agents](/docs/agents) for the supported tools and how each one takes credentials and mid-run messages.

## How gates relate

Every stage begins with a gate. New projects default to manual approval on all stages, so a person reviews the branch, the write-up included, before the next agent starts. Sending a card back stops the agent and waits for input; approving it starts the next stage with the committed write-ups in place. A gate can be made automatic once its requirements can decide: a successful run, a passing command, green GitHub checks, resolved review threads, or a judge agent.

A judge agent is a second agent on the same card, configured through its own skill and best given a different model from the working agent. It works from the same branch, write-up included, and an incomplete verdict holds the card and displays the reason. See [Gates](/docs/pipeline#gates).

## Not a chat dump

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

Stage write-ups exist for downstream stages, not for reviewers of the pull request. Before publication, Bento removes the `docs/bento/` files from the branch tip, so the PR diff contains code changes only. The files remain in git history. If you prefer to keep them in the pull request, turn that on under **Settings, GitHub**. See [stage artifacts in pull requests](/docs/pull-requests#stage-artifacts-in-pull-requests).

## Writing a skill that produces a good handoff

The stage prompt asks for a summary; the skill decides what a useful one contains. Name the sections you want the next stage to be able to rely on. A skill for an engineering stage might end with:

```text
In your stage write-up, record the approach you chose and the alternatives
you rejected, the risks and anything that cannot be undone, and the files
the implementation stage should start from. Ask for any decision you need
rather than guessing at it.
```

Skills are edited under **Agents**, or exported and imported as YAML. See [the agents file](/docs/pipeline#the-agents-file).

## Go deeper

- [How Bento works](/docs/concepts): cards, sandboxes, worktrees, and where artifacts are written.
- [Pipelines](/docs/pipeline): stages, gates, judge agents, skills, and the pipeline and agents files.
- [Coding agents](/docs/agents): the supported tools, their credentials, and how each takes mid-run messages.
- [Pull requests](/docs/pull-requests): publishing, and what happens to `docs/bento/` files on the way out.
- [Web console](/docs/web-app): running Bento locally or self-hosting it with Docker.

## Getting started

Handoff artifacts are part of every plan, including Free, which comes with 3 members and 5 agent hours a month. [Create an account](https://app.usebento.ai/) to set up a pipeline, or [compare plans on the pricing page](/pricing).
