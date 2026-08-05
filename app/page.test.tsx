import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Bento landing page", () => {
  it("presents the product story in a single accessible document", () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "See the whole lifecycle",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Every feature has a route." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Your judgment has a place." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Different agents. One handoff." }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "From idea to pull request." }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The sandbox is the boundary." }),
    ).toBeInTheDocument();
    expect(container.querySelector("#product")).toBeInTheDocument();
    expect(container.querySelector("#how-it-works")).toBeInTheDocument();
    expect(container.querySelector("#security")).toBeInTheDocument();
  });

  it("keeps prohibited dash characters out of visible copy", () => {
    const { container } = render(<Home />);

    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("keeps heading levels in document order", () => {
    render(<Home />);
    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(
      levels.every(
        (level, index) => index === 0 || level <= levels[index - 1]! + 1,
      ),
    ).toBe(true);
  });

  it("renders the initial hero without waiting for animation", () => {
    const { container } = render(<Home />);

    expect(container.querySelector(".hero-copy")).not.toHaveStyle({
      opacity: "0",
    });
    expect(container.querySelector(".hero-visual")).not.toHaveStyle({
      opacity: "0",
    });
  });
});
