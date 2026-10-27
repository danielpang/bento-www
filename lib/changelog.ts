interface ChangelogMediaBase {
  /** Path under /public. */
  src: string;
  /** Describes what the media shows; the entry still reads without it. */
  alt: string;
  /** Intrinsic size, so the copy below never shifts while the media loads. */
  width: number;
  height: number;
}

export interface ChangelogImage extends ChangelogMediaBase {
  type: "image";
}

export interface ChangelogVideo extends ChangelogMediaBase {
  type: "video";
  /** Still frame to hold the space until the first video frame paints. */
  poster?: string;
}

/** A demo recording: a video where we have one, an image otherwise. */
export type ChangelogMedia = ChangelogImage | ChangelogVideo;

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
    slug: "swarms-for-everyone",
    date: "2026-10-25",
    displayDate: "October 25, 2026",
    title: "Swarms for everyone",
    description:
      "The Swarms tab is shown to everyone. Local Bento runs swarms in your own Docker, and hosted swarms open to Pro plans and above from a waitlist.",
    paragraphs: [
      "Swarms are no longer a beta feature. Every board now shows the Swarms tab, where one goal becomes a plan and a swarm of agents works through it.",
      "See [Swarms](/docs/swarms) for how a swarm plans, runs, and lands its work.",
    ],
    sections: [
      {
        title: "Who can run swarms",
        points: [
          {
            label: "Local Bento",
            body: "Swarms are always on. They run in your own Docker, on your machine.",
          },
          {
            label: "Hosted Bento",
            body: "Swarms need a Pro plan or above. On a subscribed team, press Join waitlist on the Swarms tab and we’ll email you when your access is ready.",
          },
          {
            label: "GitHub",
            body: "A hosted swarm needs a GitHub connection and a GitHub remote on every repository, so its branches are saved to GitHub as soon as there is work on them.",
          },
        ],
      },
      {
        title: "You choose the pull requests",
        paragraphs: [
          "Nothing opens a pull request automatically when a swarm finishes. From the swarm’s header, choose one combined pull request of the swarm’s branch, or stacked pull requests, one per task that merged, each against the task before it. You can publish at any time once something is committed.",
        ],
      },
    ],
  },
  {
    slug: "model-keys-stay-out-of-agent-sandboxes",
    date: "2026-10-23",
    displayDate: "October 23, 2026",
    title: "Model proxy for LLM providers",
    description:
      "Hosted Bento sends model calls through a model proxy, so an agent’s sandbox contains a proxy token for the run instead of your API key.",
    paragraphs: [
      "Your model API keys now stay out of agent sandboxes. Hosted Bento sends every model call through a model proxy, so the sandbox contains a proxy token, not your key. The token only works for that run, and only for model endpoints.",
      "See [Security](/docs/security) for how the proxy works and which setups still give a key to the agent.",
    ],
    sections: [
      {
        title: "Allowed sites",
        paragraphs: [
          "Teams that block agent network access can now list Allowed sites in Settings, Team. When a team MCP server is enabled, its host is added for you.",
        ],
      },
      {
        title: "In the Mac app",
        points: [
          {
            label: "Agent sandbox type",
            body: "The start screen picks Docker sandbox, the default, which isolates each agent in a container, or Local process, which runs agents directly on your Mac and is for development only.",
          },
          {
            label: "Model proxy",
            body: "On by default with the Docker sandbox, so the container contains a proxy token rather than your key. Turn it off under Advanced settings, Model proxy.",
          },
        ],
      },
    ],
  },
  {
    slug: "bento-mac-app",
    date: "2026-09-24",
    displayDate: "September 24, 2026",
    title: "Bento for Mac",
    description:
      "Bento is now available as a Mac app for Apple silicon and Intel, with local Docker agents or a sign in to hosted Bento.",
    paragraphs: [
      "We’re excited to launch Bento for Mac! You can now keep your agent pipeline in a desktop app, sign in to hosted Bento, or run agents in Docker on your own Mac.",
    ],
    sections: [
      {
        title: "Download the app",
        paragraphs: [
          "[Download Bento for Mac](/download) for Apple silicon or Intel. Open the DMG, drag Bento to Applications, and launch it from there. No separate Node.js installation is needed.",
        ],
      },
      {
        title: "Choose where agents run",
        points: [
          {
            label: "Local",
            body: "Choose Run locally to keep your board, its history, and agent runs on your machine. You’ll need Docker Desktop or OrbStack for local agents.",
          },
          {
            label: "Hosted",
            body: "Choose Sign in or sign up to use hosted Bento at app.usebento.ai, then finish signing in through your browser. There is no server address to enter. Agents run on hosted Bento, so you won’t need Docker on your Mac.",
          },
        ],
      },
      {
        title: "Set up your workflow",
        points: [
          {
            label: "Repositories",
            body: "Add your projects and tell Bento how they install dependencies and run tests. In local mode, use the native folder picker to choose a checkout.",
          },
          {
            label: "Agents",
            body: "Pick the harness and model you want, add its credentials, and give the agent a skill to follow.",
          },
          {
            label: "Pipeline",
            body: "Use the same board and pipeline controls as the web app. Start with manual review, then automate gates when you’re ready.",
          },
        ],
        paragraphs: [
          "For setup and connection details, see the [Mac app guide](https://github.com/danielpang/bento/blob/main/apps/desktop/README.md).",
        ],
      },
    ],
  },
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
      type: "video",
      src: "/changelog/bento-tui-demo.mp4",
      alt: "A screen recording of the Bento TUI running in a terminal",
      width: 1716,
      height: 964,
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
    media: {
      type: "video",
      src: "/changelog/bento-slack-launch-16x9.mp4",
      alt: "A demo of creating a Bento feature by tagging @bento in Slack and following its progress in the thread",
      width: 1920,
      height: 1080,
    },
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
    media: {
      type: "video",
      src: "/changelog/bento-linear-launch-16x9.mp4",
      alt: "A demo of turning a Linear issue into a Bento feature and starting the agent pipeline",
      width: 1920,
      height: 1080,
    },
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
