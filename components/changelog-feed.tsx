import Link from "next/link";
import type { ChangelogEntry } from "@/lib/changelog";
import { ChangelogEntryContent } from "./changelog-entry-content";

interface ChangelogFeedProps {
  entries: ChangelogEntry[];
}

export function ChangelogFeed({ entries }: ChangelogFeedProps) {
  return (
    <div className="changelog-feed">
      {entries.map((entry) => (
        <article className="changelog-entry" id={entry.slug} key={entry.slug}>
          <header className="changelog-entry-meta">
            <Link
              className="changelog-entry-date"
              href={`/changelog/${entry.slug}`}
            >
              <time dateTime={entry.date}>{entry.displayDate}</time>
            </Link>
          </header>
          <div className="changelog-entry-body">
            <h2 className="changelog-entry-title">
              <Link href={`/changelog/${entry.slug}`}>{entry.title}</Link>
            </h2>
            <ChangelogEntryContent entry={entry} />
          </div>
        </article>
      ))}
    </div>
  );
}
