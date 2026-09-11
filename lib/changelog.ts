export interface ChangelogEntry {
  /**
   * The entry's URL under /changelog and its anchor on the feed. Descriptive,
   * so the standalone page ranks for what shipped rather than for a date.
   */
  slug: string;
  /** ISO date, also the URL each entry originally published under. */
  date: string;
  displayDate: string;
  /** The entry's H1 and document title. Unique across the changelog. */
  title: string;
  /**
   * The entry's meta description; also its one-line note in /llms.txt.
   * Restates the body, so it never claims more than the entry does.
   */
  description: string;
  paragraphs: string[];
  sections?: ChangelogSection[];
}

export interface ChangelogSection {
  title: string;
  paragraphs?: string[];
  points?: Array<{
    label: string;
    body: string;
  }>;
  installCommand?: boolean;
}

export const changelogEntries: ChangelogEntry[] = [
  {
    slug: "bento-terminal-ui",
    date: "2026-09-11",
    displayDate: "September 11, 2026",
    title: "Bento TUI",
    description:
      "Bento is now available in your terminal, with local and hosted agent run modes plus full agent and pipeline setup.",
    paragraphs: [
      "The Bento board now runs in your terminal. Track cards, follow live agent conversations, inspect artifacts and diffs, and control the pipeline without leaving the command line.",
    ],
    sections: [
      {
        title: "Install the CLI",
        paragraphs: [
          "Install Bento on macOS or glibc Linux, follow the printed PATH instruction, then run bento setup. Local agents also require Docker.",
        ],
        installCommand: true,
      },
      {
        title: "Choose where agents run",
        points: [
          {
            label: "Local",
            body: "Keep the board, history, and agents on your machine in local Docker sandboxes.",
          },
          {
            label: "Hosted",
            body: "Connect the TUI to usebento.ai and run agents in server-managed sandboxes. Your laptop does not need Docker.",
          },
          {
            label: "Hybrid",
            body: "Keep the shared board in the cloud while a local runner executes agents against your checkouts.",
          },
        ],
      },
      {
        title: "Set up your workflow",
        points: [
          {
            label: "Repositories",
            body: "Connect each checkout and add its dependency setup and test commands.",
          },
          {
            label: "Agents",
            body: "Choose a harness and model, save its credentials, and define the skill it follows.",
          },
          {
            label: "Pipeline",
            body: "Assign agents to stages, start with manual review, then automate gates when their requirements are reliable.",
          },
        ],
        paragraphs: [
          "Read the [Bento TUI guide](/docs/tui) for complete setup instructions and keyboard shortcuts.",
        ],
      },
    ],
  },
  {
    slug: "google-antigravity-cli",
    date: "2026-09-05",
    displayDate: "September 5, 2026",
    title: "Google Antigravity CLI as a coding agent",
    description:
      "Bento supports Google Antigravity CLI as a coding agent. Pair it with a Gemini model and a skill, then assign it to any pipeline stage.",
    paragraphs: [
      "Bento now supports Google Antigravity CLI as a coding agent.",
      "Pair it with a Gemini model and a skill, then assign it to any pipeline stage.",
      "See the [Antigravity website](https://antigravity.google) and [Antigravity CLI GitHub](https://github.com/google-antigravity/antigravity-cli).",
    ],
  },
  {
    slug: "deepseek-models-and-harness",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "DeepSeek models and harness",
    description:
      "Bento includes DeepSeek models and a harness to run them. Pair DeepSeek with a skill and assign it to any pipeline stage, like any other coding agent.",
    paragraphs: [
      "Bento now includes DeepSeek models and a harness to run them.",
      "Pair DeepSeek with a skill and assign it to any pipeline stage, the same way you use the other coding agents.",
      "See the [DeepSeek website](https://www.deepseek.com) and [DeepSeek GitHub](https://github.com/deepseek-ai).",
    ],
  },
  {
    slug: "poolside-coding-agent",
    date: "2026-08-23",
    displayDate: "August 23, 2026",
    title: "Poolside as a coding agent",
    description:
      "Bento supports Poolside as a coding agent. Pair it with a model and a skill, then assign it to any pipeline stage.",
    paragraphs: [
      "Bento now supports Poolside as a coding agent.",
      "Pair it with a model and a skill, then assign it to any pipeline stage.",
      "See the [Poolside website](https://www.poolside.ai) and [Poolside GitHub](https://github.com/poolsideai).",
    ],
  },
  {
    slug: "slack-integration",
    date: "2026-08-19",
    displayDate: "August 19, 2026",
    title: "Slack integration",
    description:
      "Create a Bento feature by tagging @bento in Slack. Install the Slack app, invite the bot to a channel, and Bento updates the thread as the card changes.",
    paragraphs: [
      "Create new Bento features by tagging @bento in Slack.",
      "First install the Slack app into your workspace and invite the Bento Slack bot into your channel. Tagging @bento then creates a new card, and Bento updates the thread on card updates.",
    ],
  },
  {
    slug: "linear-integration",
    date: "2026-08-14",
    displayDate: "August 14, 2026",
    title: "Linear integration",
    description:
      "New Linear tickets can create a Bento feature and start the pipeline. Features created in Bento can be created in Linear with a default team and project.",
    paragraphs: [
      "New tickets in Linear can automatically create a Bento feature, with the option to start the pipeline automatically.",
      "New features in Bento can also be created in Linear if you set up a default Linear team and project under project settings.",
    ],
  },
];

export function getChangelogEntry(slug: string): ChangelogEntry | null {
  return changelogEntries.find((entry) => entry.slug === slug) ?? null;
}

/**
 * Entries first published under /changelog/<date>. Those URLs still resolve,
 * as permanent redirects to the descriptive slug.
 */
export function getChangelogEntryByDate(date: string): ChangelogEntry | null {
  return changelogEntries.find((entry) => entry.date === date) ?? null;
}

export function getChangelogSlugs(): string[] {
  return changelogEntries.map((entry) => entry.slug);
}
