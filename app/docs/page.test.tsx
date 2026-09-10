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
      screen.getByRole("heading", { level: 1, name: "Guides" }),
    ).toBeInTheDocument();

    for (const doc of listDocs()) {
      expect(
        within(index as HTMLElement).getByRole("link", {
          name: (_, element) =>
            element.getAttribute("href") === `/docs/${doc.slug}`,
        }),
      ).toBeInTheDocument();
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

  it("says which Bento this is before the guides", () => {
    const { container } = render(<DocsIndexPage />);
    const header = container.querySelector(".docs-header")!;

    expect(header.querySelector(".docs-lead")).toHaveTextContent(/agent pipeline/);
    expect(header.querySelector(".docs-note")).toHaveTextContent(siteDisambiguation);
    expect(metadata.description).toContain("agent pipeline");
    expect(metadata.description).toContain("usebento.ai");
    expect(container.textContent).not.toMatch(/[—–]/);
  });
});
