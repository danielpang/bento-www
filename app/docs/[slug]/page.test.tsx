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
    for (const slug of ["concepts", "tui", "agents", "pull-requests", "web-app", "clients"]) {
      const { container, unmount } = render(await DocPage(params(slug)));
      expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
      unmount();
    }
  });

  it("answers the why-pipeline question first, then the three pains", async () => {
    const { container } = render(await DocPage(params("why-agent-pipeline")));
    const body = container.querySelector(".docs-body") as HTMLElement;
    const doc = getDoc("why-agent-pipeline")!;

    expect(
      screen.getByRole("heading", { level: 1, name: doc.meta.heading }),
    ).toBeInTheDocument();
    expect(container.querySelector(".docs-lead")).toBeNull();
    expect(body.firstElementChild?.tagName).toBe("P");
    expect(body.firstElementChild).toHaveTextContent(/^If you run coding agents all day/);
    expect(body.firstElementChild).toHaveTextContent(/re-prompting every stage by hand/);

    const pains = [
      "Context doesn't survive the next session",
      "You shouldn't have to prompt every stage",
      "Laptop-only agents don't travel",
    ];
    for (const title of pains) {
      const question = screen.getByRole("heading", { level: 2, name: title });
      expect(question.nextElementSibling?.tagName).toBe("P");
    }

    for (const link of within(body).getAllByRole("link", { name: "How it works" })) {
      expect(link).toHaveAttribute("href", "/docs/concepts");
    }
    for (const link of within(body).getAllByRole("link", { name: "Pipelines" })) {
      expect(link).toHaveAttribute("href", "/docs/pipeline");
    }
    const pipelineLink = within(body)
      .getAllByRole("link")
      .find((link) => link.textContent === "pipeline");
    expect(pipelineLink).toHaveAttribute("href", "/docs/pipeline");
    expect(within(body).getByRole("link", { name: "shared board" })).toHaveAttribute(
      "href",
      "/docs/concepts",
    );
    expect(within(body).getByRole("link", { name: "remote sandbox" })).toHaveAttribute(
      "href",
      "/docs/concepts#cards-sandboxes-and-worktrees",
    );
    expect(within(body).getByRole("link", { name: "compare plans" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(within(body).getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "https://app.usebento.ai/",
    );

    const nav = screen.getByRole("complementary", { name: "Documentation" });
    expect(within(nav).getByRole("link", { name: "Why an agent pipeline" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(container.textContent).not.toContain("/docs/handoff-artifacts");
  });

  it("publishes the three visible pains as FAQPage structured data", async () => {
    const { container } = render(await DocPage(params("why-agent-pipeline")));
    const questions = getDoc("why-agent-pipeline")!.meta.questions!;

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(3);

    for (const [index, entry] of data.mainEntity.entries()) {
      const question = screen.getByRole("heading", { level: 2, name: entry.name });
      expect(question.nextElementSibling).toHaveTextContent(entry.acceptedAnswer.text);
      expect(entry).toEqual({
        "@type": "Question",
        name: questions[index]!.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: questions[index]!.body,
        },
      });
    }
    expect(screen.queryByRole("heading", { name: "Questions" })).toBeNull();
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
    for (const slug of ["tui", "pipeline", "agents", "pull-requests", "web-app", "clients", "why-agent-pipeline"]) {
      const { container, unmount } = render(await DocPage(params(slug)));
      expect(container.querySelector(".docs-figure")).toBeNull();
      unmount();
    }
  });

  it("documents TUI installation, run placement, agents, and pipelines", async () => {
    const { container } = render(await DocPage(params("tui")));
    const body = container.querySelector(".docs-body") as HTMLElement;

    expect(screen.getByRole("heading", { level: 1, name: "TUI" })).toBeInTheDocument();
    expect(within(body).getByText("curl -fsSL https://usebento.ai/install.sh | sh")).toBeInTheDocument();
    expect(within(body).getByRole("heading", { level: 2, name: "Choose where agents run" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { level: 3, name: "Hosted board and server agents" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { level: 3, name: "Configure agents" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { level: 3, name: "Build the pipeline" })).toBeInTheDocument();
    expect(within(body).getByRole("link", { name: "Coding agents" })).toHaveAttribute("href", "/docs/agents");
    expect(within(body).getByRole("link", { name: "Pipelines" })).toHaveAttribute("href", "/docs/pipeline");
  });

  it("puts a copy control on every fenced command in the guides", async () => {
    for (const slug of ["concepts", "tui", "pipeline", "agents", "pull-requests", "web-app", "clients", "why-agent-pipeline"]) {
      const { container, unmount } = render(await DocPage(params(slug)));
      const body = container.querySelector(".docs-body") as HTMLElement;
      const blocks = body.querySelectorAll("pre");
      const buttons = within(body).queryAllByRole("button", { name: "Copy command" });
      expect(buttons, slug).toHaveLength(blocks.length);
      for (const block of blocks) {
        expect(block.closest(".docs-code"), slug).not.toBeNull();
        expect(block.nextElementSibling, slug).toHaveAttribute("aria-label", "Copy command");
      }
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

  it("uses the question as the why-pipeline title and the long-tail description", async () => {
    const doc = getDoc("why-agent-pipeline")!;
    const metadata = await generateMetadata(params("why-agent-pipeline"));

    expect(metadata.title).toBe(doc.meta.heading);
    expect(metadata.description).toBe(doc.meta.metaDescription);
    expect(metadata.alternates?.canonical).toBe("/docs/why-agent-pipeline");
    expect(metadata.openGraph).toMatchObject({
      title: `${doc.meta.heading} | Bento docs`,
      url: "/docs/why-agent-pipeline",
    });
  });
});
