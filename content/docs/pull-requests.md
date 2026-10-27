# Pull requests

Agents commit in the sandbox. GitHub publication is a separate server-side step.

## Opening a pull request

**Create a pull request** is on for every stage unless you turn it off, including the stages a new project starts with and any stage you add. After a successful run, the server pushes the feature branch and opens or updates one pull request per repository with commits. All stages on a card share one branch. A stage that only wrote its own notes, such as engineering requirements, has nothing for a reviewer yet, so the pull request opens when a stage commits code.

**Create PR** in the card drawer publishes the current commits without waiting for the stage to complete.

The card lists open pull requests by repository. Multi-repo cards require a PR in each repo for completion gates (`checks_pass`, `pr_comments_resolved`). Untouched repositories are skipped. Stages without the flag keep work in the worktree only.

## Swarm pull requests

A swarm opens no pull request by itself. Its branches are pushed to GitHub as work lands, and you publish from the swarm's header when you choose, even before the swarm finishes: **One pull request** opens one of the swarm's branch (a draft until the swarm is done), and **One per task, stacked** opens one per committed task, each against the task committed before it. Clicking again finishes a publish that was cut off and updates the same pull requests. See [Swarms](/docs/swarms).

## Stage artifacts in pull requests

Stages write summaries under `docs/bento/` for downstream stages. Before publication, Bento removes these files from the branch tip. The PR diff contains code changes only. Files remain in git history.

You can keep the artifacts under **Settings, GitHub**. On shared servers, the setting is organization-scoped (owner or admin). Local installs store it with machine settings.

## Push and attribution

The server pushes the changes; agents do not receive push credentials. Publishing rejects protected branches (`main`, `master`, `trunk`, `develop`). See [Security](/docs/security) for what else stays out of the sandbox.

Commit author is configured under **Settings, GitHub**. Defaults to `Bento Agent <no-reply@usebento.ai>` if no values are set.

## GitHub connection

You can connect to GitHub with the following options:

**Personal access token** (local and self-hosted): set `GITHUB_TOKEN` under **Settings, GitHub** or in `.env`. Requires Contents and Pull requests write on target repositories.

**GitHub App** (hosted Bento at [usebento.ai](/)): An organization owner installs the App and selects repositories. Bento stores short-lived installation tokens per organization.

Without either, agents commit locally. The transcript will report that GitHub is not configured.

**Create a GitHub App with the following values:**

| Setting     | Value                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Where can this GitHub App be installed? | Any account. A private App can only be authorized by members of the account that owns it, and GitHub answers everyone else with a 404 on the sign in page. |
| Setup URL   | `<server URL>/api/github/callback`                                                                 |
| Webhook URL | `<server URL>/api/webhooks/github`                                                                 |
| Permissions | Contents R/W, Pull requests R/W, Checks read, Metadata read                                        |
| Events      | installation, installation repositories, pull request, check run, check suite, pull request review |

Then set the following values as environment variables: `GITHUB_APP_ID`, `GITHUB_APP_SLUG`, `GITHUB_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
