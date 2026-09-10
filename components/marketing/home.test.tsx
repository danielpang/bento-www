import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDisambiguation } from "@/lib/copy";
import { productFaq } from "@/lib/faq";
import { MarketingHome } from "./home";

describe("redesigned homepage", () => {
  it("names the agent pipeline and which Bento this is above the fold", () => {
    const { container } = render(<MarketingHome />);

    const hero = container.querySelector(".m-hero .hero-copy");
    expect(hero).not.toBeNull();
    expect(hero!.querySelector("p")).toHaveTextContent(/agent pipeline/);
    expect(hero!.querySelector(".hero-note")).toHaveTextContent(siteDisambiguation);
    // The note follows the call to action rather than displacing it.
    const children = Array.from(hero!.children).map((child) => child.className);
    expect(children.indexOf("hero-actions")).toBeLessThan(
      children.findIndex((name) => name.includes("hero-note")),
    );
  });

  it("publishes the visible questions as FAQPage structured data", () => {
    const { container } = render(<MarketingHome />);

    expect(screen.getByRole("heading", { name: "Questions" })).toBeInTheDocument();
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(
      productFaq.map((question) => question.title),
    );
    expect(
      Array.from(container.querySelectorAll(".faq-section dd")).map((detail) => detail.textContent),
    ).toEqual(productFaq.map((question) => question.body));
  });

  it("keeps the questions before the closing call to action", () => {
    const { container } = render(<MarketingHome />);

    const main = container.querySelector("main")!;
    const sections = Array.from(main.children).map((child) => child.className);
    expect(sections.findIndex((name) => name.includes("faq-section"))).toBeLessThan(
      sections.findIndex((name) => name.includes("m-bottom-cta")),
    );
    expect(container.textContent).not.toMatch(/[—–]/);
  });
});
