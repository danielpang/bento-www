import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
