import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { listDocs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Guides for running Bento: pipelines, agents, pull requests, and the web console.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Bento documentation",
    description:
      "Guides for running Bento: pipelines, agents, pull requests, and the web console.",
    type: "website",
    url: "/docs",
  },
};

export default function DocsIndexPage() {
  const docs = listDocs();

  return (
    <DocsShell
      docs={docs}
      lead="Start with how cards move through stages, then dig into agents, pull requests, and setup."
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
