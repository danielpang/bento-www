import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDescription, siteDisambiguation, siteHeadline } from "@/lib/copy";
import Home from "@/components/marketing/control-home";

describe("Bento landing page", () => {
  it("presents the product story in a single accessible document", async () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: siteHeadline,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(siteDescription)).toBeInTheDocument();
    // The lifecycle section hydrates from its own chunk, so it arrives async here.
    expect(
      await screen.findByRole("heading", { name: "Every feature has a route." }),
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
    expect(
      screen.getByRole("heading", {
        name: "Start a card from Linear or Slack.",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("#product")).toBeInTheDocument();
    expect(container.querySelector("#how-it-works")).toBeInTheDocument();
    expect(container.querySelector("#security")).toBeInTheDocument();
    expect(container.querySelector("#integrations")).toBeInTheDocument();

    expect(
      Array.from(
        container.querySelectorAll("#security, #integrations"),
        (section) => section.id,
      ),
    ).toEqual(["security", "integrations"]);
  });

  it("wraps one existing phrase per section with a link to the matching guide", async () => {
    const { container } = render(<Home />);
    await screen.findByRole("heading", { name: "Every feature has a route." });
    const main = container.querySelector("main") as HTMLElement;

    const sectionLinks: Array<[selector: string, name: string, href: string]> = [
      [".lifecycle-heading", "Define any pipeline you want", "/docs/pipeline"],
      [".gate-copy", "Every stage starts manual.", "/docs/pipeline#gates"],
      [".handoff-section .section-heading", "Pick the right tool and model for each stage", "/docs/agents"],
      [".handoff-artifact", "durable write-up", "/docs/concepts"],
      [".security-intro", "per-feature environment", "/docs/concepts#what-a-sandbox-contains"],
      [".integration-card:not(.integration-card-slack)", "Tasks created in Linear", "/changelog/linear-integration"],
      [".integration-card-slack", "create a card", "/changelog/slack-integration"],
    ];
    for (const [selector, name, href] of sectionLinks) {
      const section = main.querySelector(selector) as HTMLElement;
      expect(section, selector).not.toBeNull();
      const link = within(section).getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveClass("copy-link");
      expect(section.querySelectorAll("a.copy-link")).toHaveLength(1);
    }
    // The copy itself is unchanged; the link wraps words already there.
    expect(main.querySelector(".gate-copy > p")).toHaveTextContent(
      "Every stage starts manual. Make it automatic only when its requirements deserve to decide.",
    );
    expect(main.innerHTML).not.toContain("handoff-artifacts");
    expect(within(main).queryByRole("link", { name: /learn more|read the docs/i })).toBeNull();
  });

  it("keeps prohibited dash characters out of visible copy", () => {
    const { container } = render(<Home />);

    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("keeps the machine-only disambiguation line out of the visible page", () => {
    const { container } = render(<Home />);

    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/Not to be confused/);
  });

  it("keeps heading levels in document order", async () => {
    render(<Home />);
    await screen.findByRole("heading", { name: "Every feature has a route." });
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
