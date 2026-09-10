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

  it("links to the documentation and the FAQ page", () => {
    const { container } = render(<MarketingHome />);

    expect(
      within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Docs" }),
    ).toHaveAttribute("href", "/docs");
    expect(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Docs" }),
    ).toHaveAttribute("href", "/docs");
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "/docs");
    expect(within(footer).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
    // The questions themselves live on /faq, not on the homepage.
    expect(screen.queryByText("What is Bento (usebento.ai)?")).not.toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    expect(container.textContent).not.toMatch(/[—–]/);
  });
});
