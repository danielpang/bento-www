import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export interface DocQuestion {
  title: string;
  body: string;
}

export interface DocMeta {
  slug: string;
  title: string;
  /** One line, shown on the docs index card, as the page lead, and in /llms.txt. */
  description: string;
  order: number;
  /**
   * Questions the guide asks and answers in its own text, as an H3 followed
   * by the answer paragraph, repeated as FAQPage JSON-LD on that page only.
   * `lib/docs.test.ts` checks the markup stays identical to the visible copy.
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
    title: "Web console",
    description:
      "Run the console from source or Docker, local and multi mode, sandbox drivers, log export.",
    order: 5,
  },
  clients: {
    title: "Other clients",
    description:
      "Terminal client progress, and where the board and agents can run.",
    order: 6,
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
