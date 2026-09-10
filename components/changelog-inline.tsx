import type { ReactNode } from "react";

/**
 * Renders the inline vocabulary changelog paragraphs use: Markdown links to
 * https URLs, which open in a new tab, and the @bento mention.
 */
export function formatChangelogInline(text: string): ReactNode[] {
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
