export interface ChangelogMedia {
  /** Path under /public. Any image format, including an animated GIF. */
  src: string;
  /** Describes what the image shows; the entry still reads without it. */
  alt: string;
  width: number;
  height: number;
}

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
  /** Shown under the entry's opening paragraph, on the feed and its page. */
  media?: ChangelogMedia;
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
      "We’re excited to launch the Bento TUI! You can now run Bento from your terminal, hook it up to our hosted server, or keep agents running in Docker on your own machine.",
    ],
    media: {
      src: "/changelog/bento-terminal-ui.jpg",
      alt: "The Bento TUI running in a terminal",
      width: 1374,
      height: 1080,
    },
    sections: [
      {
        title: "Install the CLI",
        paragraphs: [
          "Getting started takes one command. We support macOS and glibc Linux. Follow the printed PATH instruction, then run bento setup. You’ll also need Docker if you want agents to run locally.",
        ],
        installCommand: true,
      },
      {
        title: "Choose where agents run",
        points: [
          {
            label: "Local",
            body: "Keep everything close: the board, its history, and every agent run on your machine in local Docker sandboxes.",
          },
          {
            label: "Hosted",
            body: "Connect to our hosted server at usebento.ai and let us run the agents. You won’t need Docker on your laptop.",
          },
          {
            label: "Hybrid",
            body: "Want a shared board but local execution? Keep the board in our cloud while a local runner works against your checkouts.",
          },
        ],
      },
      {
        title: "Set up your workflow",
        points: [
          {
            label: "Repositories",
            body: "Point Bento at each checkout and tell it how your project installs dependencies and runs tests.",
          },
          {
            label: "Agents",
            body: "Pick the harness and model you want, add its credentials, and give the agent a skill to follow.",
          },
          {
            label: "Pipeline",
            body: "Shape the stages around how your team works. Start with manual review, then automate gates when you’re ready.",
          },
        ],
        paragraphs: [
          "We’ve put the full walkthrough, including setup details and keyboard shortcuts, in the [Bento TUI guide](/docs/tui).",
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
