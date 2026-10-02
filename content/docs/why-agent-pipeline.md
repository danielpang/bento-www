# Why coding agents lose your context (and your process)

If you run coding agents all day, you already know the pattern. Each chat is its own little world. Close the tab and the context is gone. You still have a real process: investigate, design, spec, build, review, QA. But you're re-prompting every stage by hand. And the agent is stuck on your laptop, so nobody else can pick up the thread.

Bento puts that work on one card. Artifacts stay with the card as it moves through the stages you already use. The board is shared; the agent runs in a remote sandbox your teammates can open. Human gates sit in that flow. They're how you keep judgment in the loop, not a separate product.

Activation looks like the first stage that finishes and leaves a durable handoff on the card: committed write-ups and a branch the next agent or teammate can open without reconstructing the last chat.

For the mechanics, start with [How it works](/docs/concepts) and [Pipelines](/docs/pipeline). If you landed here from a search for a different Bento, see [Which Bento is usebento.ai?](/docs/which-bento).

## Context doesn't survive the next session

Most people juggle several agent chats at once. Each one keeps its own history; none of them share state. Bento parks the work on a single card: branch, notes, and write-ups under `docs/bento/`, so the next agent (or a teammate) starts from files, not a paste from last night's chat. More in [How it works](/docs/concepts).

## You shouldn't have to prompt every stage

You already know the order of work. Typing "now write the spec," then "now implement," then "now review" is just running that process through a chat box. A [pipeline](/docs/pipeline) turns those stages into the product: each step has an agent, a skill, and a gate when a human should decide.

## Laptop-only agents don't travel

A session on your machine isn't remote and isn't shareable. Teammates can't open it; you can't resume it elsewhere. On Bento the card lives on a [shared board](/docs/concepts), and the agent runs in a [remote sandbox](/docs/concepts#cards-sandboxes-and-worktrees) you can pick up from any device.

Pipelines are on every plan, including Free (3 members, 5 agent hours a month). [Create an account](https://app.usebento.ai/) or [compare plans](/pricing).
