import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs-shell";
import { JsonLd } from "@/components/json-ld";
import { MarkdownContent } from "@/components/markdown-content";
import { getDoc, getDocSlugs, listDocs } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";
import { faqPageJsonLd } from "@/lib/structured-data";

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

  const heading = doc.meta.heading ?? doc.meta.title;
  return pageMetadata({
    title: heading,
    description: doc.meta.description,
    path: `/docs/${slug}`,
    socialTitle: `${heading} | Bento docs`,
    type: "article",
  });
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const questions = doc.meta.questions;

  return (
    <>
      {/* The same questions the <dl> below shows, so the two cannot drift. */}
      {questions ? <JsonLd data={faqPageJsonLd(questions)} /> : null}
      <DocsShell
        currentSlug={slug}
        docs={listDocs()}
        lead={doc.meta.description}
        title={doc.meta.heading ?? doc.meta.title}
      >
        <MarkdownContent content={doc.content} />
        {questions ? (
          <section aria-labelledby="questions" className="docs-faq">
            <h2 id="questions">Questions</h2>
            <dl>
              {questions.map((question) => (
                <div key={question.title}>
                  <dt>{question.title}</dt>
                  <dd>{question.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </DocsShell>
    </>
  );
}
