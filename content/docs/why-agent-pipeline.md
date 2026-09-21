# Why do coding-agent sessions lose context, skip your process, and stay on one laptop?

In Bento, the agent pipeline at [usebento.ai](/), each feature is one card. Committed artifacts keep context across coding-agent sessions, and the card moves through the stages you already run instead of a prompt you type by hand. The board is shared; the agent runs in a remote sandbox teammates can pick up. Gates and the sandbox are how that holds, not a second product.

This page is the short route in. The mechanics live in [How it works](/docs/concepts) and [Pipelines](/docs/pipeline).

## Why do coding-agent sessions lose context?

Every engineer runs several coding-agent sessions at once, and each session keeps its own chat. Close the window and the state goes with it. Bento puts the work on one card: one branch, and the stage write-ups committed under docs/bento/<stage>.md, so the next agent or a teammate starts from files, not a paste. See [How it works](/docs/concepts).

## Why do engineers still prompt every step by hand?

You already have a process: investigate, design, spec, implement, code review, QA. Prompting each step by hand means the agent only does what you remember to ask. The [agent pipeline](/docs/pipeline) is that process as stages, each with an agent, a skill, and a gate. See [Pipelines](/docs/pipeline).

## Why do coding agents stay stuck on one laptop?

A laptop session is not remote and not shareable. Teammates cannot open it, and you cannot pick it up on another machine. Bento is a [shared board](/docs/concepts): the card is visible to the team as it moves through the [pipeline](/docs/pipeline), and the agent runs in a [remote sandbox](/docs/concepts#cards-sandboxes-and-worktrees) you can resume from any device. The sandbox is how that session leaves the laptop, not a separate product.

An agent pipeline is part of every plan, including Free, which comes with 3 members and 5 agent hours a month. [Create an account](https://app.usebento.ai/) to set up a pipeline, or [compare plans on the pricing page](/pricing).
