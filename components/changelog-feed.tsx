import Link from "next/link";
import type { ReactNode } from "react";
import type { ChangelogEntry } from "@/lib/changelog";

interface ChangelogFeedProps {
  entries: ChangelogEntry[];
}

function formatInline(text: string): ReactNode[] {
  return text.split(/(@bento)/g).map((part, index) =>
    part === "@bento" ? <code key={index}>@bento</code> : part,
  );
}

export function ChangelogFeed({ entries }: ChangelogFeedProps) {
  return (
    <div className="changelog-feed">
      {entries.map((entry) => (
        <article
          className="changelog-entry"
          id={entry.slug}
          key={entry.slug}
        >
          <header className="changelog-entry-meta">
            <Link
              className="changelog-entry-date"
              href={`/changelog/${entry.slug}`}
            >
              <time dateTime={entry.date}>{entry.displayDate}</time>
            </Link>
            <span className="changelog-entry-kind">Changelog</span>
          </header>
          <div className="changelog-entry-body">
            <h2>{entry.title}</h2>
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph}>{formatInline(paragraph)}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
