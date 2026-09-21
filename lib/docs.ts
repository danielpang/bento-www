import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export interface DocQuestion {
  title: string;
  body: string;
}

export interface DocMeta {
  slug: string;
  /** Short label used in the docs navigation and index. */
  title: string;
  /**
   * The page's H1 and document title when it should differ from the label:
   * a guide that answers a question leads with the question people ask.
   */
  heading?: string;
  /** One line, shown on the docs index card, as the page lead, and in /llms.txt. */
  description: string;
  /**
   * Longer search description when the index blurb is too short for the query.
   * Falls back to `description`.
   */
  metaDescription?: string;
  order: number;
  /**
   * Questions the guide asks and answers in its own text, as an H2 or H3
   * followed by the answer paragraph, repeated as FAQPage JSON-LD on that
   * page only. `lib/docs.test.ts` checks the markup stays identical to the
   * visible copy.
   */
  questions?: readonly DocQuestion[];
}

const DOCS_DIR = path.join(process.cwd(), "content/docs");

/** The docs hub description, shared by its metadata and /llms.txt. */
export const docsIndexDescription =
  "Guides for Bento, the agent pipeline at usebento.ai: why an agent pipeline, then pipelines, agents, pull requests, the Web UI, and TUI.";

const DOC_META: Record<
  string,
  Omit<DocMeta, "slug">
> = {
  "why-agent-pipeline": {
    title: "Why an agent pipeline",
    heading:
      "Why do coding-agent sessions lose context, skip your process, and stay on one laptop?",
    description:
      "Coding agent context, a real pipeline, and shared remote agents on one board.",
    metaDescription:
      "Coding-agent sessions lose context, skip your process, and stay on one laptop. Bento keeps artifacts on one card, runs an agent pipeline, and shares remote agents on a team board.",
    order: 0,
    questions: [
      {
        title: "Why do coding-agent sessions lose context?",
        body: "Every engineer runs several coding-agent sessions at once, and each session keeps its own chat. Close the window and the state goes with it. Bento puts the work on one card: one branch, and the stage write-ups committed under docs/bento/<stage>.md, so the next agent or a teammate starts from files, not a paste. See How it works.",
      },
      {
        title: "Why do engineers still prompt every step by hand?",
        body: "You already have a process: investigate, design, spec, implement, code review, QA. Prompting each step by hand means the agent only does what you remember to ask. The agent pipeline is that process as stages, each with an agent, a skill, and a gate. See Pipelines.",
      },
      {
        title: "Why do coding agents stay stuck on one laptop?",
        body: "A laptop session is not remote and not shareable. Teammates cannot open it, and you cannot pick it up on another machine. Bento is a shared board: the card is visible to the team as it moves through the pipeline, and the agent runs in a remote sandbox you can resume from any device. The sandbox is how that session leaves the laptop, not a separate product.",
      },
    ],
  },
  concepts: {
    title: "How it works",
    description:
      "How a card moves through stages: one branch, one sandbox, context in committed files.",
    order: 1,
  },
  pipeline: {
    title: "Pipelines",
    description:
      "Stages, human gates and their requirements, judge agents, and pipeline YAML.",
    order: 2,
    questions: [
      {
        title: "How do human gates work in a multi-agent pipeline?",
        body: "In Bento, the agent pipeline at usebento.ai, every stage begins with a gate, and new projects default to manual approval on all six stages. A person reviews the stage's output, then approves the card, sends it back, or steers the agent. Switch a stage to automatic once its requirements can decide: the card advances when every listed criterion passes, and holds when one fails.",
      },
    ],
  },
  agents: {
    title: "Coding agents",
    description:
      "Claude Code, Codex, Cursor, opencode, pi, Poolside, DeepSeek, Antigravity: keys and steering.",
    order: 3,
  },
  "pull-requests": {
    title: "Pull requests",
    description:
      "Publishing agent work as GitHub pull requests, attribution, and GitHub connections.",
    order: 4,
  },
  "web-app": {
    title: "Web UI",
    description:
      "Run the Web UI from source or Docker, local and multi mode, sandbox drivers, log export.",
    order: 5,
  },
  tui: {
    title: "TUI",
    description:
      "Install the TUI, choose where agents run, and configure projects, agents, and pipelines.",
    order: 6,
  },
  clients: {
    title: "Other clients",
    description:
      "Compare the Web UI and terminal client, including features and agent placement.",
    order: 7,
  },
};

function titleFromMarkdown(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

export function listDocs(): DocMeta[] {
  const files = readdirSync(DOCS_DIR).filter((name) => name.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const meta = DOC_META[slug];
      const markdown = readFileSync(path.join(DOCS_DIR, file), "utf8");

      return {
        slug,
        title: meta?.title ?? titleFromMarkdown(markdown, slug),
        description: meta?.description ?? "Bento documentation.",
        order: meta?.order ?? 99,
        ...(meta?.heading ? { heading: meta.heading } : {}),
        ...(meta?.metaDescription ? { metaDescription: meta.metaDescription } : {}),
        ...(meta?.questions ? { questions: meta.questions } : {}),
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getDoc(slug: string): { meta: DocMeta; content: string } | null {
  const meta = listDocs().find((doc) => doc.slug === slug);
  if (!meta) return null;

  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  try {
    const content = readFileSync(filePath, "utf8");
    return { meta, content };
  } catch {
    return null;
  }
}

export function getDocSlugs(): string[] {
  return listDocs().map((doc) => doc.slug);
}
