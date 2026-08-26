import type { Metadata } from "next";
import { ChangelogFeed } from "@/components/changelog-feed";
import { ChangelogShell } from "@/components/changelog-shell";
import { changelogEntries } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Product updates for Bento, including coding agents, models, and integrations.",
  alternates: {
    canonical: "/changelog",
  },
  openGraph: {
    title: "Changelog | Bento",
    description:
      "Product updates for Bento, including coding agents, models, and integrations.",
    type: "website",
    url: "/changelog",
  },
};

export default function ChangelogPage() {
  return (
    <ChangelogShell>
      <header className="changelog-header">
        <h1>Changelog</h1>
      </header>
      <ChangelogFeed entries={changelogEntries} />
    </ChangelogShell>
  );
}
