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
        <article className="changelog-entry" key={entry.slug}>
          <header className="changelog-entry-meta">
            <h2 className="changelog-entry-heading" id={entry.slug}>
              <a
                className="changelog-entry-date"
                href={`/changelog#${entry.slug}`}
              >
                <time dateTime={entry.date}>{entry.displayDate}</time>
              </a>
            </h2>
          </header>
          <div className="changelog-entry-body">
            <h3>{entry.title}</h3>
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph}>{formatInline(paragraph)}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
