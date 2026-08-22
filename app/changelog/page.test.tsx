import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { changelogEntries } from "@/lib/changelog";
import ChangelogPage, { metadata } from "./page";

describe("Changelog", () => {
  it("renders dated entries newest first with permalinks and no versions", () => {
    const { container } = render(<ChangelogPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Slack integration" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Linear integration" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) =>
        element?.textContent ===
        "Create new Bento features by tagging @bento in Slack.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/default Linear team and project/i),
    ).toBeInTheDocument();

    const entries = container.querySelectorAll(".changelog-entry");
    expect(Array.from(entries, (entry) => entry.id)).toEqual(
      changelogEntries.map((entry) => entry.slug),
    );

    for (const entry of changelogEntries) {
      const article = container.querySelector(`[id="${entry.slug}"]`);
      expect(article).not.toBeNull();
      expect(
        within(article as HTMLElement).getByRole("link", {
          name: entry.displayDate,
        }),
      ).toHaveAttribute("href", `/changelog/${entry.slug}`);
    }

    expect(container.textContent).not.toMatch(/\bv?\d+\.\d+/);
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(metadata.openGraph).toMatchObject({
      title: "Changelog | Bento",
      url: "/changelog",
    });
    expect(
      screen.queryByRole("heading", {
        name: "Give every feature a clear next step.",
      }),
    ).not.toBeInTheDocument();
  });
});
