import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDisambiguation } from "@/lib/copy";
import { MarketingHome } from "./home";

describe("redesigned homepage", () => {
  it("names the agent pipeline above the fold without the machine-only note", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero .hero-copy");
    expect(hero).not.toBeNull();
    expect(hero!.querySelector("p")).toHaveTextContent(/agent pipeline/);
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/Not to be confused/);
  });

  it("links to the documentation from the header and footer", () => {
    const { container } = render(<MarketingHome />);

    expect(
      within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Docs" }),
    ).toHaveAttribute("href", "/docs");
    expect(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Docs" }),
    ).toHaveAttribute("href", "/docs");
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("wraps one existing phrase per section with a link to the matching guide", () => {
    const { container } = render(<MarketingHome />);
    const main = container.querySelector("main") as HTMLElement;

    const sectionLinks: Array<[selector: string, name: string, href: string]> = [
      [".m-agents", "harnesses and models", "/docs/agents"],
      [".m-stage-intro", "each pipeline stage", "/docs/pipeline"],
      [".m-gate-layout", "manual gate", "/docs/pipeline#gates"],
      [".m-context-handoff", "Stage write-ups are committed alongside the code", "/docs/concepts"],
      [".m-security", "its own environment", "/docs/concepts#what-a-sandbox-contains"],
    ];
    for (const [selector, name, href] of sectionLinks) {
      const section = main.querySelector(selector) as HTMLElement;
      const link = within(section).getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveClass("copy-link");
      expect(section.querySelectorAll("a.copy-link")).toHaveLength(1);
    }
    // The copy itself is unchanged; the link wraps words already there.
    expect(main.querySelector(".m-gate-layout .m-section-heading p")).toHaveTextContent(
      "Every stage starts with a manual gate. Review, approve, or steer the work. Automate when you’re ready.",
    );
    expect(main.innerHTML).not.toContain("handoff-artifacts");
    expect(within(main).queryByRole("link", { name: /learn more|read the docs/i })).toBeNull();
  });
});
