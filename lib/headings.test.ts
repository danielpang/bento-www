import { describe, expect, it } from "vitest";
import { extractHeadings, headingText, slugify } from "./headings";

describe("docs headings", () => {
  it("slugs headings the way existing links expect", () => {
    expect(slugify("GitHub connection")).toBe("github-connection");
    expect(slugify("Cards, sandboxes and worktrees")).toBe("cards-sandboxes-and-worktrees");
    expect(slugify("Context doesn't survive the next session")).toBe("context-doesnt-survive-the-next-session");
    expect(slugify("Poolside (pool)")).toBe("poolside-pool");
  });

  it("reads a heading's visible text without inline markdown", () => {
    expect(headingText("The `bento_agents.yaml` file")).toBe("The bento_agents.yaml file");
    expect(headingText("**Bold** and [a link](/docs) ##")).toBe("Bold and a link");
    expect(headingText("_Emphasis_ keeps snake_case")).toBe("Emphasis keeps snake_case");
  });

  it("nests H3 sections under their H2 and skips headings in code fences", () => {
    const toc = extractHeadings(`# Title

Intro.

## First

### Inner one

\`\`\`md
## Not a heading
\`\`\`

### Inner two

## Second
`);

    expect(toc).toEqual([
      {
        id: "first",
        text: "First",
        level: 2,
        children: [
          { id: "inner-one", text: "Inner one", level: 3, children: [] },
          { id: "inner-two", text: "Inner two", level: 3, children: [] },
        ],
      },
      { id: "second", text: "Second", level: 2, children: [] },
    ]);
  });
});
