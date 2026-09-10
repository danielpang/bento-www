import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDisambiguation } from "@/lib/copy";
import { listDocs } from "@/lib/docs";
import DocsIndexPage, { metadata } from "./page";

describe("Documentation index", () => {
  it("lists the Bento guides", () => {
    const { container } = render(<DocsIndexPage />);
    const index = container.querySelector(".docs-index-list");

    expect(index).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 1, name: "Bento documentation" }),
    ).toBeInTheDocument();

    // Each card is a heading that links to the guide, with its one-line blurb.
    const cards = (index as HTMLElement).querySelectorAll("li");
    expect(cards).toHaveLength(listDocs().length);
    for (const [i, doc] of listDocs().entries()) {
      const card = cards[i] as HTMLElement;
      const heading = within(card).getByRole("heading", { level: 2, name: doc.title });
      expect(within(heading).getByRole("link", { name: doc.title })).toHaveAttribute(
        "href",
        `/docs/${doc.slug}`,
      );
      expect(card.querySelector("p")).toHaveTextContent(doc.description);
    }

    expect(metadata.openGraph).toMatchObject({
      title: "Bento documentation",
      url: "/docs",
    });
    expect(
      screen.queryByRole("heading", {
        name: "Give every feature a clear next step.",
      }),
    ).not.toBeInTheDocument();
  });

  it("defines Bento as an agent pipeline without the machine-only note", () => {
    const { container } = render(<DocsIndexPage />);
    const header = container.querySelector(".docs-header")!;

    expect(header.querySelector(".docs-lead")).toHaveTextContent(/agent pipeline/);
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(metadata.description).toContain("agent pipeline");
    expect(metadata.description).toContain("usebento.ai");
    expect(container.textContent).not.toMatch(/[—–]/);
  });
});
