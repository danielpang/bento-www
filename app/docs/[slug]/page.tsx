import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs-shell";
import { JsonLd } from "@/components/json-ld";
import { MarkdownContent } from "@/components/markdown-content";
import { getDoc, getDocSlugs, listDocs } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";
import { faqPageJsonLd } from "@/lib/structured-data";

// The diagram carries the motion library, so only the guide that shows it
// loads that chunk.
const PipelineFlowDiagram = dynamic(() =>
  import("@/components/pipeline-flow-diagram").then((m) => m.PipelineFlowDiagram),
);

/** Interactive figures shown under a guide's lead, keyed by slug. */
const docFigures: Record<string, () => ReactNode> = {
  concepts: () => <PipelineFlowDiagram />,
};

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) {
    return { title: "Documentation" };
  }

  return pageMetadata({
    title: doc.meta.title,
    description: doc.meta.description,
    path: `/docs/${slug}`,
    socialTitle: `${doc.meta.title} | Bento docs`,
    type: "article",
  });
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  return (
    <>
      {/* Questions the guide's own text asks and answers, nothing more. */}
      {doc.meta.questions ? (
        <JsonLd data={faqPageJsonLd(doc.meta.questions)} />
      ) : null}
      <DocsShell
        currentSlug={slug}
        docs={listDocs()}
        figure={docFigures[slug]?.()}
        lead={doc.meta.description}
        title={doc.meta.title}
      >
        <MarkdownContent content={doc.content} />
      </DocsShell>
    </>
  );
}
