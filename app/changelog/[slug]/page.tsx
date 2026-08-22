import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChangelogFeed } from "@/components/changelog-feed";
import { ChangelogShell } from "@/components/changelog-shell";
import {
  getChangelogEntry,
  getChangelogSlugs,
} from "@/lib/changelog";

interface ChangelogEntryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getChangelogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ChangelogEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) {
    return { title: "Changelog" };
  }

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: `/changelog/${entry.slug}`,
    },
    openGraph: {
      title: `${entry.title} | Bento`,
      description: entry.description,
      type: "article",
      url: `/changelog/${entry.slug}`,
    },
  };
}

export default async function ChangelogEntryPage({
  params,
}: ChangelogEntryPageProps) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  return (
    <ChangelogShell>
      <header className="changelog-header">
        <h1>Changelog</h1>
      </header>
      <ChangelogFeed entries={[entry]} />
    </ChangelogShell>
  );
}
