import type { ReactNode } from "react";
import type { ChangelogEntry } from "@/lib/changelog";

interface ChangelogFeedProps {
  entries: ChangelogEntry[];
}

function formatInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  const pattern = /@bento|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (match[0] === "@bento") {
      nodes.push(<code key={key}>@bento</code>);
    } else {
      nodes.push(
        <a href={match[2]} key={key} rel="noreferrer" target="_blank">
          {match[1]}
        </a>,
      );
    }

    key += 1;
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
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
