import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDisambiguation } from "@/lib/copy";
import { getDoc } from "@/lib/docs";
import DocPage, { generateMetadata } from "./page";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("Documentation page", () => {
  it("answers the handoff question first, then links pricing and signup", async () => {
    const { container } = render(await DocPage(params("handoff-artifacts")));
    const body = container.querySelector(".docs-body") as HTMLElement;

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "How do I pass context to the next agent?",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector(".docs-lead")).toHaveTextContent(
      /agent pipeline at usebento\.ai/,
    );
    // The direct answer is the first thing under the heading.
    expect(body.firstElementChild?.tagName).toBe("P");
    expect(body.firstElementChild).toHaveTextContent(/handoff artifact/);
    expect(body.firstElementChild).toHaveTextContent(/agent pipeline at usebento\.ai/);
    expect(body.firstElementChild).toHaveTextContent("docs/bento/<stage>.md");

    expect(within(body).getByRole("link", { name: "compare plans on the pricing page" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(within(body).getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "https://app.usebento.ai/",
    );
    const agentLinks = within(body).getAllByRole("link", { name: "Coding agents" });
    expect(agentLinks.length).toBeGreaterThan(1);
    for (const link of agentLinks) {
      expect(link).toHaveAttribute("href", "/docs/agents");
    }
    expect(within(body).getByRole("link", { name: "Gates" })).toHaveAttribute(
      "href",
      "/docs/pipeline#gates",
    );

    const nav = screen.getByRole("complementary", { name: "Documentation" });
    expect(within(nav).getByRole("link", { name: "Handoff artifacts" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("publishes the visible questions as FAQPage structured data", async () => {
    const { container } = render(await DocPage(params("handoff-artifacts")));

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");

    const shownQuestions = Array.from(container.querySelectorAll(".docs-faq dt")).map(
      (term) => term.textContent,
    );
    const shownAnswers = Array.from(container.querySelectorAll(".docs-faq dd")).map(
      (detail) => detail.textContent,
    );
    expect(shownQuestions).toEqual(getDoc("handoff-artifacts")!.meta.questions!.map((q) => q.title));
    expect(data.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(shownQuestions);
    expect(
      data.mainEntity.map((entry: { acceptedAnswer: { text: string } }) => entry.acceptedAnswer.text),
    ).toEqual(shownAnswers);
    expect(screen.getByRole("heading", { level: 2, name: "Questions" })).toBeInTheDocument();
  });

  it("leaves the other guides without a questions section or FAQ markup", async () => {
    const { container } = render(await DocPage(params("pipeline")));

    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    expect(container.querySelector(".docs-faq")).toBeNull();
  });

  it("describes the page for search and social cards", async () => {
    const metadata = await generateMetadata(params("handoff-artifacts"));

    expect(metadata.title).toBe("How do I pass context to the next agent?");
    expect(metadata.description).toContain("agent pipeline");
    expect(metadata.description).toContain("usebento.ai");
    expect(metadata.alternates?.canonical).toBe("/docs/handoff-artifacts");
    expect(metadata.openGraph).toMatchObject({
      title: "How do I pass context to the next agent? | Bento docs",
      url: "/docs/handoff-artifacts",
    });

    // Guides without a heading keep their label as the title.
    const pipeline = await generateMetadata(params("pipeline"));
    expect(pipeline.title).toBe("Pipelines");
  });
});
