import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingHomePromise,
  marketingProblemBeats,
  marketingProblemHeading,
  marketingProblemLead,
  siteDisambiguation,
} from "@/lib/copy";
import { MarketingHome } from "./home";

describe("redesigned homepage", () => {
  it("names the agent pipeline above the fold without the machine-only note", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero .hero-copy");
    expect(hero).not.toBeNull();
    expect(hero!.querySelector("h1")).toHaveTextContent(/Your agents\.\s*One shipping team/);
    expect(hero!.querySelector("p")).toHaveTextContent(marketingHomePromise);
    expect(container.querySelector(".m-hero .m-demo")).not.toBeNull();
    expect(container.querySelector(".m-hero .m-demo")).toHaveAttribute("id", "product");
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/Not to be confused/);
  });

  it("combines the lifecycle pains into one visual section after the agents", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero");
    const agents = container.querySelector(".m-agents");
    const context = container.querySelector(".m-context");
    expect(hero).not.toBeNull();
    expect(agents).not.toBeNull();
    expect(context).not.toBeNull();
    expect(hero!.compareDocumentPosition(agents!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(agents!.compareDocumentPosition(context!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(
      within(context as HTMLElement).getByRole("heading", {
        level: 2,
        name: marketingProblemHeading,
      }),
    ).toBeInTheDocument();
    expect(within(context as HTMLElement).getByText(marketingProblemLead)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Model coding agents around your existing/i }),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".m-problem-beats")).toBeNull();
    expect(container.querySelector(".m-product-demo")).toBeNull();

    const scenes = container.querySelectorAll(".m-context .m-stage-showcase");
    expect(scenes).toHaveLength(3);
    for (const [index, beat] of marketingProblemBeats.entries()) {
      expect(
        within(scenes[index] as HTMLElement).getByRole("heading", {
          level: 3,
          name: beat.title,
        }),
      ).toHaveTextContent(beat.title);
      expect(within(scenes[index] as HTMLElement).getByText(beat.body)).toBeInTheDocument();
    }

    expect(within(context as HTMLElement).getByRole("figure", { name: /one card in each stage/i })).toBeInTheDocument();
    expect(within(context as HTMLElement).getByRole("figure", { name: /local laptop talking to a cloud VM/i })).toBeInTheDocument();
    expect(container.querySelector(".m-skill-showcase")).not.toBeNull();
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
