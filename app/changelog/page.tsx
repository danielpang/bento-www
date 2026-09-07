import { ChangelogFeed } from "@/components/changelog-feed";
import { ChangelogShell } from "@/components/changelog-shell";
import { changelogEntries } from "@/lib/changelog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Changelog",
  description:
    "Product updates for Bento, including coding agents, models, and integrations.",
  path: "/changelog",
});

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
