import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { docsIndexDescription, listDocs } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Documentation",
  description: docsIndexDescription,
  path: "/docs",
  socialTitle: "Bento documentation",
});

export default function DocsIndexPage() {
  const docs = listDocs();

  return (
    <DocsShell
      docs={docs}
      lead="Bento is a multi-agent SDLC pipeline: each feature is one card on a shared board, with human gates and a dedicated sandbox. Stage handoffs stay in the repo so PM through QA keeps context. Start with why an agent pipeline, then how cards move, then security, agents, pull requests, and setup."
      title="Bento documentation"
    >
      <p>
        If coding-agent sessions lose context or skip the process you already
        have, start with{" "}
        <Link href="/docs/why-agent-pipeline">why an agent pipeline</Link>.
      </p>
      <ul className="docs-index-list">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <h2>
              <Link href={`/docs/${doc.slug}`}>{doc.title}</Link>
            </h2>
            <p>{doc.description}</p>
          </li>
        ))}
      </ul>
    </DocsShell>
  );
}
