import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs-shell";
import { MarkdownContent } from "@/components/markdown-content";
import { getDoc, getDocSlugs, listDocs } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";

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
    <DocsShell
      currentSlug={slug}
      docs={listDocs()}
      lead={doc.meta.description}
      title={doc.meta.title}
    >
      <MarkdownContent content={doc.content} />
    </DocsShell>
  );
}
