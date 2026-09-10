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
      lead="Bento is an agent pipeline: coding agents move each feature through your stages, behind human gates and inside their own sandboxes. Start with how cards move through stages, then dig into agents, pull requests, and setup."
      title="Guides"
    >
      <ul className="docs-index-list">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link href={`/docs/${doc.slug}`}>
              <span>{doc.title}</span>
              <p>{doc.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </DocsShell>
  );
}
