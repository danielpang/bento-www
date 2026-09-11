import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingHomeHeadline,
  marketingHomePromise,
  marketingProblemBeats,
  marketingProblemHeading,
  siteDisambiguation,
} from "@/lib/copy";
import { MarketingHome } from "./home";

describe("redesigned homepage", () => {
  it("names the agent pipeline above the fold without the machine-only note", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero .hero-copy");
    expect(hero).not.toBeNull();
    expect(hero!.querySelector("h1")).toHaveTextContent(marketingHomeHeadline);
    expect(hero!.querySelector("p")).toHaveTextContent(marketingHomePromise);
    expect(hero!.querySelector(".m-demo")).toBeNull();
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/Not to be confused/);
  });

  it("places the problem beats after the supported agents and before the pipeline demo", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero");
    const agents = container.querySelector(".m-agents");
    const problem = container.querySelector(".m-problem");
    const demo = container.querySelector(".m-product-demo");
    expect(hero).not.toBeNull();
    expect(agents).not.toBeNull();
    expect(problem).not.toBeNull();
    expect(demo).not.toBeNull();
    expect(hero!.compareDocumentPosition(agents!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(agents!.compareDocumentPosition(problem!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(problem!.compareDocumentPosition(demo!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(
      within(problem as HTMLElement).getByRole("heading", {
        level: 2,
        name: marketingProblemHeading,
      }),
    ).toBeInTheDocument();
    for (const beat of marketingProblemBeats) {
      expect(
        within(problem as HTMLElement).getByRole("heading", {
          level: 3,
          name: beat.title,
        }),
      ).toHaveTextContent(beat.title);
      expect(within(problem as HTMLElement).getByText(beat.body)).toBeInTheDocument();
    }

    expect(demo).toHaveAttribute("id", "product");
    expect(demo!.querySelector(".m-demo")).not.toBeNull();
    expect(container.querySelector(".m-hero .m-demo")).toBeNull();
    expect(screen.queryByRole("heading", { name: /faq/i })).not.toBeInTheDocument();
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
    expect(within(footer).getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(container.querySelector("main a[href='/docs']")).toBeNull();
  });
});
