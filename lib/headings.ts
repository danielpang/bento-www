/**
 * Heading ids and the table of contents for the docs.
 *
 * `MarkdownContent` gives every rendered H2 and H3 an id from `slugify`, and
 * the guide sidebar lists the same headings read from the markdown source,
 * so both sides must agree. Links across the site (and from the app) point
 * at these ids, such as `/docs/pull-requests#github-connection`, so the rule
 * must not change.
 */

export interface DocHeading {
  id: string;
  text: string;
  level: 2 | 3;
  /** H3 sections under this H2. Always empty for an H3. */
  children: DocHeading[];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** The visible text of a markdown heading line, without inline syntax. */
export function headingText(source: string): string {
  return (
    source
      // A closing ATX sequence ("## Title ##").
      .replace(/\s+#+\s*$/, "")
      // Split out code spans so emphasis stripping never touches their text.
      .split(/(`+[^`]*`+)/)
      .map((part) => {
        if (/^`+[\s\S]*`+$/.test(part)) {
          return part.replace(/^`+\s?|\s?`+$/g, "");
        }
        return part
          .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
          .replace(/\*+/g, "")
          .replace(/(^|\W)_+|_+(?=\W|$)/g, "$1");
      })
      .join("")
      .trim()
  );
}

/** The guide's H2 sections, each with its H3 sections, in document order. */
export function extractHeadings(markdown: string): DocHeading[] {
  const sections: DocHeading[] = [];
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1]!;
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const match = line.match(/^\s{0,3}(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;

    const text = headingText(match[2]!);
    const heading: DocHeading = {
      id: slugify(text),
      text,
      level: match[1]!.length as 2 | 3,
      children: [],
    };
    const parent = sections.at(-1);
    if (heading.level === 3 && parent) parent.children.push(heading);
    else sections.push(heading);
  }

  return sections;
}
