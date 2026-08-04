import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LifecycleSection } from "./lifecycle-section";

describe("LifecycleSection", () => {
  it("preserves the semantic lifecycle order with sequence markers", () => {
    render(<LifecycleSection />);

    const lifecycle = screen.getByRole("list", {
      name: "Default product lifecycle",
    });
    const headings = within(lifecycle)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    const markers = Array.from(
      lifecycle.querySelectorAll(".lifecycle-step"),
      (marker) => marker.textContent?.trim(),
    );

    expect(headings).toEqual([
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]);
    expect(markers).toEqual(["01", "02", "03", "04", "05", "06"]);
  });
});
