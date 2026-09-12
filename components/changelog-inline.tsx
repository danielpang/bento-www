import type { ReactNode } from "react";

/**
 * Renders the inline vocabulary changelog paragraphs use: Markdown links and
 * the @bento mention. External links open in a new tab; site links do not.
 */
export function formatChangelogInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  const pattern = /@bento|\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[a-z0-9/_-]*)\)/g;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (match[0] === "@bento") {
      nodes.push(<code key={key}>@bento</code>);
    } else {
      const href = match[2];
      const isExternal = href.startsWith("http");
      nodes.push(
        <a
          href={href}
          key={key}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
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
