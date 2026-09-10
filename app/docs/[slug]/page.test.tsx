import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteDisambiguation } from "@/lib/copy";
import { getDoc } from "@/lib/docs";
import DocPage, { generateMetadata } from "./page";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("Documentation page", () => {
  it("answers the gates question above the criteria table, then links pricing and signup", async () => {
    const { container } = render(await DocPage(params("pipeline")));
    const body = container.querySelector(".docs-body") as HTMLElement;

    expect(
      screen.getByRole("heading", { level: 1, name: "Pipelines" }),
    ).toBeInTheDocument();
    const gates = screen.getByRole("heading", { level: 2, name: "Gates" });
    expect(gates).toHaveAttribute("id", "gates");
    const question = screen.getByRole("heading", {
      level: 3,
      name: "How do human gates work in a multi-agent pipeline?",
    });
    expect(gates.nextElementSibling).toBe(question);
    const answer = question.nextElementSibling as HTMLElement;
    expect(answer.tagName).toBe("P");
    expect(answer).toHaveTextContent(/^In Bento, the agent pipeline at usebento\.ai/);
    expect(within(answer).getByRole("link", { name: "usebento.ai" })).toHaveAttribute("href", "/");
    // The existing table follows the answer unchanged.
    expect(answer.nextElementSibling).toHaveTextContent("All criteria on a stage must pass:");
    expect(answer.nextElementSibling?.nextElementSibling?.querySelector("table")).not.toBeNull();

    expect(within(body).getByRole("link", { name: "compare plans on the pricing page" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(within(body).getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "https://app.usebento.ai/",
    );
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("publishes the visible gates question as FAQPage structured data on the pipeline guide", async () => {
    const { container } = render(await DocPage(params("pipeline")));

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(1);

    const [entry] = data.mainEntity;
    const question = screen.getByRole("heading", { level: 3, name: entry.name });
    expect(question.nextElementSibling).toHaveTextContent(entry.acceptedAnswer.text);
    expect(entry).toEqual({
      "@type": "Question",
      name: getDoc("pipeline")!.meta.questions![0].title,
      acceptedAnswer: {
        "@type": "Answer",
        text: getDoc("pipeline")!.meta.questions![0].body,
      },
    });
    // No appended questions block: the Q&A lives in the guide's own text.
    expect(screen.queryByRole("heading", { name: "Questions" })).toBeNull();
  });

  it("leaves the other guides without FAQ markup", async () => {
    for (const slug of ["concepts", "agents", "pull-requests", "web-app", "clients"]) {
      const { container, unmount } = render(await DocPage(params(slug)));
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
      unmount();
    }
  });

  it("opens How it works with the interactive pipeline diagram, above the guide text", async () => {
    const { container } = render(await DocPage(params("concepts")));

    const figure = await screen.findByRole("figure", { name: /Default pipeline/ });
    const slot = container.querySelector(".docs-figure") as HTMLElement;
    expect(slot).toContainElement(figure);
    expect(slot.nextElementSibling).toHaveClass("docs-body");
    expect(container.querySelector(".docs-header")!.nextElementSibling).toBe(slot);

    const track = within(figure).getByRole("list", { name: "Pipeline stages" });
    expect(within(track).getAllByRole("listitem")).toHaveLength(7);
    expect(within(figure).getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("keeps the other guides free of the diagram", async () => {
    for (const slug of ["pipeline", "agents", "pull-requests", "web-app", "clients"]) {
      const { container, unmount } = render(await DocPage(params(slug)));
      expect(container.querySelector(".docs-figure")).toBeNull();
      unmount();
    }
  });

  it("wears the redesigned marketing theme and navigation like the homepage", async () => {
    const { container } = render(await DocPage(params("concepts")));

    expect(container.firstElementChild).toHaveClass("marketing-page");
    expect(
      within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Docs" }),
    ).toHaveAttribute("href", "/docs");
    expect(
      within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Pricing" }),
    ).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("describes the page for search and social cards", async () => {
    const metadata = await generateMetadata(params("pipeline"));

    expect(metadata.title).toBe("Pipelines");
    expect(metadata.description).toBe(getDoc("pipeline")!.meta.description);
    expect(metadata.alternates?.canonical).toBe("/docs/pipeline");
    expect(metadata.openGraph).toMatchObject({
      title: "Pipelines | Bento docs",
      url: "/docs/pipeline",
    });
  });
});
