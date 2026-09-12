import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ChangelogEntryContent } from "@/components/changelog-entry-content";
import { ChangelogShell } from "@/components/changelog-shell";
import { JsonLd } from "@/components/json-ld";
import {
  changelogEntries,
  getChangelogEntry,
  getChangelogEntryByDate,
} from "@/lib/changelog";
import { pageMetadata } from "@/lib/metadata";
import { techArticleJsonLd } from "@/lib/structured-data";

interface ChangelogEntryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  // The descriptive slugs are the pages; the dates are their old URLs and
  // prerender as redirects so nothing that was ever linked breaks.
  return changelogEntries.flatMap((entry) => [
    { slug: entry.slug },
    { slug: entry.date },
  ]);
}

export async function generateMetadata({
  params,
}: ChangelogEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug) ?? getChangelogEntryByDate(slug);
  if (!entry) {
    return { title: "Changelog" };
  }

  return pageMetadata({
    title: entry.title,
    description: entry.description,
    path: `/changelog/${entry.slug}`,
    socialTitle: `${entry.title} | Bento changelog`,
    type: "article",
  });
}

export default async function ChangelogEntryPage({
  params,
}: ChangelogEntryPageProps) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) {
    const byDate = getChangelogEntryByDate(slug);
    if (byDate) permanentRedirect(`/changelog/${byDate.slug}`);
    notFound();
  }

  const path = `/changelog/${entry.slug}`;

  return (
    <ChangelogShell>
      <JsonLd
        data={techArticleJsonLd({
          title: entry.title,
          description: entry.description,
          date: entry.date,
          path,
        })}
      />
      <article className="changelog-post">
        <header className="changelog-header changelog-post-header">
          <p className="changelog-post-crumb">
            <Link href="/changelog">
              <ArrowLeft aria-hidden="true" size={14} weight="bold" />
              Changelog
            </Link>
          </p>
          <h1>{entry.title}</h1>
          <p className="changelog-post-date">
            <time dateTime={entry.date}>{entry.displayDate}</time>
          </p>
        </header>
        <div className="changelog-entry-body changelog-post-body">
          <ChangelogEntryContent entry={entry} />
        </div>
        <footer className="changelog-post-footer">
          <p>
            <Link href="/changelog">All product updates</Link>
          </p>
        </footer>
      </article>
    </ChangelogShell>
  );
}
