import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
    title: "Changelog",
    description: entry.description,
    alternates: {
      canonical: "/changelog",
    },
  };
}

export default async function ChangelogEntryPage({
  params,
}: ChangelogEntryPageProps) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  redirect(`/changelog#${entry.slug}`);
}
