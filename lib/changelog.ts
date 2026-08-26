export interface ChangelogEntry {
  slug: string;
  date: string;
  displayDate: string;
  title: string;
  description: string;
  paragraphs: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    slug: "2026-08-26",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "DeepSeek models and harness",
    description:
      "Run DeepSeek models in Bento with a dedicated harness.",
    paragraphs: [
      "Bento now includes DeepSeek models and a harness to run them.",
      "Pair DeepSeek with a skill and assign it to any pipeline stage, the same way you use the other coding agents.",
    ],
  },
  {
    slug: "2026-08-23",
    date: "2026-08-23",
    displayDate: "August 23, 2026",
    title: "Poolside coding agent",
    description:
      "Use Poolside as a coding agent in Bento pipelines.",
    paragraphs: [
      "Bento now supports Poolside as a coding agent.",
      "Pair it with a model and a skill, then assign it to any pipeline stage.",
    ],
  },
  {
    slug: "2026-08-19",
    date: "2026-08-19",
    displayDate: "August 19, 2026",
    title: "Slack integration",
    description:
      "Create new Bento features by tagging @bento in Slack. Bento updates the thread as the card changes.",
    paragraphs: [
      "Create new Bento features by tagging @bento in Slack.",
      "First install the Slack app into your workspace and invite the Bento Slack bot into your channel. Tagging @bento then creates a new card, and Bento updates the thread on card updates.",
    ],
  },
  {
    slug: "2026-08-14",
    date: "2026-08-14",
    displayDate: "August 14, 2026",
    title: "Linear integration",
    description:
      "Linear tickets can automatically create a Bento feature and start the pipeline. Features in Bento can also be created in Linear.",
    paragraphs: [
      "New tickets in Linear can automatically create a Bento feature, with the option to start the pipeline automatically.",
      "New features in Bento can also be created in Linear if you set up a default Linear team and project under project settings.",
    ],
  },
];

export function getChangelogEntry(slug: string): ChangelogEntry | null {
  return changelogEntries.find((entry) => entry.slug === slug) ?? null;
}

export function getChangelogSlugs(): string[] {
  return changelogEntries.map((entry) => entry.slug);
}
