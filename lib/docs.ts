import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

const DOCS_DIR = path.join(process.cwd(), "content/docs");

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
  "pull-requests": {
    title: "Pull requests",
    description: "Opening PRs, attribution, and GitHub connections.",
    order: 4,
  },
  "web-app": {
    title: "Web console",
    description: "Local setup, containers, and day-to-day console use.",
    order: 5,
  },
  clients: {
    title: "Other clients",
    description:
      "TUI and web app progress, plus the macOS client alongside them.",
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
