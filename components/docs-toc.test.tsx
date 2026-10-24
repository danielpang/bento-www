import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocsToc } from "./docs-toc";

const items = [
  { id: "one", text: "One", level: 2 as const, children: [] },
  {
    id: "two",
    text: "Two",
    level: 2 as const,
    children: [{ id: "two-a", text: "Two A", level: 3 as const, children: [] }],
  },
];

function placeHeadings(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    const heading = document.createElement("h2");
    heading.id = id;
    heading.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.append(heading);
  }
}

describe("DocsToc", () => {
  afterEach(() => {
    document.querySelectorAll("h2").forEach((heading) => heading.remove());
    vi.restoreAllMocks();
  });

  it("links every section and marks the one passing the reading line", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    placeHeadings({ one: -400, two: 80, "two-a": 600 });
    render(<DocsToc items={items} label="Guide sections" />);

    const list = screen.getByRole("list", { name: "Guide sections" });
    expect(list).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Two A" })).toHaveAttribute("href", "#two-a");
    expect(await screen.findByRole("link", { name: "Two" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Two" })).toHaveClass("is-current");
    expect(screen.getByRole("link", { name: "One" })).not.toHaveAttribute("aria-current");
  });

  it("closes the mobile menu when a section is chosen", () => {
    render(
      <details open>
        <summary>Guides</summary>
        <DocsToc items={items} label="Guide sections" />
      </details>,
    );
    const menu = document.querySelector("details") as HTMLDetailsElement;

    fireEvent.click(screen.getByRole("link", { name: "Two A" }));

    expect(menu.open).toBe(false);
    expect(screen.getByRole("link", { name: "Two A" })).toHaveAttribute("aria-current", "location");
  });
});
