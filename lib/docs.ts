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
  description: string;
  order: number;
  /**
   * Short answers shown at the end of the guide and repeated as FAQPage
   * JSON-LD. Only guides written to answer a problem query carry them; the
   * page renders the same entries, so the markup never says more than the
   * visible copy.
   */
  questions?: readonly DocQuestion[];
}

const DOCS_DIR = path.join(process.cwd(), "content/docs");

/** The docs hub description, shared by its metadata and /llms.txt. */
export const docsIndexDescription =
  "Guides for Bento, the agent pipeline at usebento.ai: pipelines, agents, pull requests, and the web console.";

const DOC_META: Record<
  string,
  Omit<DocMeta, "slug">
> = {
  concepts: {
    title: "How it works",
    description: "Cards, sandboxes, spend, and tenancy.",
    order: 1,
  },
  pipeline: {
    title: "Pipelines",
    description: "Stages, gates, agents, and repository commands.",
    order: 2,
  },
  agents: {
    title: "Coding agents",
    description: "Supported tools, credentials, and live steering.",
    order: 3,
  },
  "handoff-artifacts": {
    title: "Handoff artifacts",
    heading: "How do I pass context to the next agent?",
    description:
      "Handoff artifacts in a Bento agent pipeline at usebento.ai: each stage commits a write-up that the next coding agent reads before it starts, so context moves with the code instead of a chat dump.",
    order: 4,
    questions: [
      {
        title: "What if a write-up leaves something out?",
        body: "The next agent has only the stage prompt and the files on the branch, so the gap is in its context too. The person at the gate can send the card back with instructions, and the skill can name what every write-up must contain.",
      },
      {
        title: "Can one stage use Claude Code and the next use Cursor?",
        body: "Yes. The handoff is a committed Markdown file, not a chat session, so any supported agent can read it. Each stage pairs its own tool, model, and skill.",
      },
      {
        title: "Do handoff artifacts end up in the pull request?",
        body: "Not by default. Bento removes the docs/bento/ files from the branch tip before publishing, so the PR diff contains code only. They remain in git history, and Settings, GitHub can keep them in the pull request.",
      },
    ],
  },
  "pull-requests": {
    title: "Pull requests",
    description: "Opening PRs, attribution, and GitHub connections.",
    order: 5,
  },
  "web-app": {
    title: "Web console",
    description: "Local setup, containers, and day-to-day console use.",
    order: 6,
  },
  clients: {
    title: "Other clients",
    description:
      "Terminal client progress, and where the board and agents can run.",
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
