import { describe, expect, it } from "vitest";
import { getDoc, listDocs } from "./docs";

describe("docs catalog", () => {
  it("exposes the copied Bento guides in a stable order", () => {
    const docs = listDocs();

    expect(docs.map((doc) => doc.slug)).toEqual([
      "why-agent-pipeline",
      "which-bento",
      "concepts",
      "pipeline",
      "agents",
      "pull-requests",
      "security",
      "web-app",
      "tui",
      "clients",
    ]);
    expect(docs.slice(-3).map((doc) => doc.title)).toEqual([
      "Web UI",
      "TUI",
      "Other clients",
    ]);
    expect(getDoc("pipeline")?.content).toMatch(/# Pipelines/);
    expect(getDoc("tui")?.content).toMatch(/# TUI/);
    expect(getDoc("clients")?.content).toContain("The TUI is now available.");
    expect(getDoc("clients")?.content).toContain("[TUI guide](/docs/tui)");
    expect(getDoc("architecture")).toBeNull();
    expect(getDoc("database-schema")).toBeNull();
    expect(getDoc("handoff-artifacts")).toBeNull();
  });

  it("leads the why-pipeline guide with a plain title, not a keyword stack", () => {
    const doc = getDoc("why-agent-pipeline")!;

    expect(doc.meta.title).toBe("Why an agent pipeline?");
    expect(doc.meta.heading).toBe("Why coding agents lose your context (and your process)");
    expect(doc.meta.description).toMatch(/lose your context/i);
    expect(doc.meta.metaDescription).toMatch(/one card/i);
    expect(doc.meta.metaDescription).toMatch(/pipeline/i);
    expect(doc.meta.metaDescription).toMatch(/remote sandbox/i);
    expect(doc.meta.heading).not.toMatch(/skip your process, and stay on one laptop/);
    expect(doc.meta.heading).not.toMatch(/[—–]/);
    expect(doc.meta.metaDescription).not.toMatch(/[—–]/);
    expect(listDocs().filter((entry) => entry.heading).map((entry) => entry.slug)).toEqual([
      "why-agent-pipeline",
      "which-bento",
    ]);
  });

  it("opens the why-pipeline guide in the voice of the three pains", () => {
    const { content, meta } = getDoc("why-agent-pipeline")!;
    const [heading, answer, follow] = content.split(/\n\n+/);

    expect(heading).toBe(`# ${meta.heading}`);
    expect(answer).toMatch(/^If you run coding agents all day/);
    expect(answer).toContain("re-prompting every stage by hand");
    expect(follow).toContain("one card");
    expect(follow).toContain("remote sandbox");
    expect(follow).toContain("not a separate product");
    expect(content).not.toMatch(/^In Bento, the agent pipeline at/m);
    expect(answer).not.toMatch(/[—–]/);
  });

  it("maps the three differentiator pains to concepts and the pipeline", () => {
    const { content } = getDoc("why-agent-pipeline")!;

    expect(content).toContain("(/docs/concepts)");
    expect(content).toContain("(/docs/pipeline)");
    expect(content).toContain("(/docs/concepts#cards-sandboxes-and-worktrees)");
    expect(content).toContain("(/pricing)");
    expect(content).toContain("(https://app.usebento.ai/)");
    expect(content).not.toContain("/docs/handoff-artifacts");
    expect(content).not.toMatch(/[—–]/);
  });

  it("gives every guide a short, unique, one-line blurb", () => {
    const docs = listDocs();
    const blurbs = new Set(docs.map((doc) => doc.description));

    expect(blurbs.size).toBe(docs.length);
    for (const doc of docs) {
      expect(doc.description.length).toBeGreaterThanOrEqual(40);
      expect(doc.description.length).toBeLessThanOrEqual(100);
      expect(doc.description).not.toMatch(/\n/);
      expect(doc.description).not.toMatch(/[—–]/);
      expect(doc.title).not.toMatch(/[—–]/);
    }
  });

  it("leads the Gates section with a question and an answer of about 60 words", () => {
    const { content } = getDoc("pipeline")!;
    const gates = content.split(/^## Gates$/m)[1]!.split(/^## /m)[0]!;
    const [, question, answer, next] = gates.split(/\n\n+/);

    expect(question).toBe("### How do human gates work in a multi-agent pipeline?");
    const words = answer.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(50);
    expect(words).toBeLessThanOrEqual(70);
    expect(answer).toMatch(/^In Bento, the agent pipeline at \[usebento\.ai\]\(\/\)/);
    expect(answer).toContain("manual approval on all six stages");
    expect(answer).toContain("sends it back");
    // The answer sits directly above the existing criteria table.
    expect(next).toBe("All criteria on a stage must pass:");
    expect(gates).toMatch(/^\| `manual` \| User approval \|$/m);
    expect(gates).toContain("**Judge agent:**");
    expect(gates).toContain("(https://app.usebento.ai/)");
    expect(gates).toContain("(/pricing)");
    expect(gates).not.toMatch(/[—–]/);
  });

  it("marks up only the questions each guide visibly asks and answers", () => {
    const withQuestions = listDocs().filter((doc) => doc.questions);
    expect(withQuestions.map((doc) => doc.slug)).toEqual([
      "why-agent-pipeline",
      "which-bento",
      "pipeline",
    ]);

    for (const doc of withQuestions) {
      const { content, meta } = getDoc(doc.slug)!;
      const plain = content
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1");
      const expectedCount =
        doc.slug === "why-agent-pipeline" || doc.slug === "which-bento" ? 3 : 1;
      expect(meta.questions).toHaveLength(expectedCount);
      for (const question of meta.questions!) {
        if (doc.slug === "pipeline") expect(question.title).toMatch(/\?$/);
        expect(question.body).not.toMatch(/[—–]/);
        expect(
          plain.includes(`### ${question.title}\n\n${question.body}\n`) ||
            plain.includes(`## ${question.title}\n\n${question.body}\n`),
        ).toBe(true);
      }
    }
  });
});
