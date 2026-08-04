import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LifecycleSection } from "./lifecycle-section";

describe("LifecycleSection", () => {
  it("explains that the displayed pipeline is configurable", () => {
    render(<LifecycleSection />);

    const heading = screen.getByRole("heading", {
      name: "Every feature has a route.",
    });
    const sectionHeading = heading.closest(".section-heading");

    expect(sectionHeading).not.toBeNull();
    expect(
      within(sectionHeading as HTMLElement).getByText(
        "This is one example. Define any pipeline you want, with the stages, agents, skills, and rules that fit your team.",
      ),
    ).toBeInTheDocument();
  });

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
    expect(lifecycle.querySelector(".lifecycle-connector")).toBeNull();
  });
});
