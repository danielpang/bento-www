# Which Bento is usebento.ai?

Several unrelated products share the name Bento. Search results and answer engines often mix them up. This page is factual and short: what each site is, and what [usebento.ai](/) ships.

## Is this the same Bento as bentonow or getbento.sh?

No. bentonow is Bento the email and marketing platform. getbento.sh is a harness-as-code project for running coding agents. Neither is the agent pipeline on this site.

## What is bentolabs.ai compared to usebento.ai?

bentolabs.ai is production agent infrastructure and observability for running agents in production. usebento.ai (this product) is a multi-agent SDLC pipeline: a shared board where each feature is one card, agents run in per-feature sandboxes, stages leave durable write-ups for the next agent, and human gates sit in the flow. It coordinates coding agents through PM, design, engineering, review, and QA without treating chat history as the system of record.

## Why not run coding agents in chat without a pipeline?

Ad hoc agent chats work for a single task, but context usually dies when the session ends, stages are re-prompted by hand, and work stays on one laptop. Bento keeps one branch and one sandbox per card, commits stage artifacts under docs/bento/, and publishes finished work as pull requests. The first meaningful win is a stage that completes and leaves a handoff the next agent (or teammate) can read from the repo, not from a pasted transcript.

For product mechanics, see [Why an agent pipeline?](/docs/why-agent-pipeline), [How it works](/docs/concepts), and [Security](/docs/security).
