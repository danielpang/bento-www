import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { changelogEntries } from "@/lib/changelog";
import ChangelogPage, { metadata } from "./page";

describe("Changelog", () => {
  it("renders dated entries newest first with heading permalinks and no versions", () => {
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
    expect(entries).toHaveLength(changelogEntries.length);
    expect(container.querySelector(".changelog-entry-kind")).toBeNull();

    for (const [index, entry] of changelogEntries.entries()) {
      const article = entries[index] as HTMLElement;
      expect(
        within(article).getByRole("heading", { name: entry.displayDate }),
      ).toHaveAttribute("id", entry.slug);
      expect(
        within(article).getByRole("link", { name: entry.displayDate }),
      ).toHaveAttribute("href", `/changelog#${entry.slug}`);
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
