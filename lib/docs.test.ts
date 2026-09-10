import { describe, expect, it } from "vitest";
import { getDoc, listDocs } from "./docs";

describe("docs catalog", () => {
  it("exposes the copied Bento guides in a stable order", () => {
    const docs = listDocs();

    expect(docs.map((doc) => doc.slug)).toEqual([
      "concepts",
      "pipeline",
      "agents",
      "handoff-artifacts",
      "pull-requests",
      "web-app",
      "clients",
    ]);
    expect(getDoc("pipeline")?.content).toMatch(/# Pipelines/);
    expect(getDoc("architecture")).toBeNull();
    expect(getDoc("database-schema")).toBeNull();
  });

  it("leads the handoff guide with the question, framed as the agent pipeline at usebento.ai", () => {
    const doc = getDoc("handoff-artifacts")!;

    expect(doc.meta.title).toBe("Handoff artifacts");
    expect(doc.meta.heading).toBe("How do I pass context to the next agent?");
    expect(doc.meta.description).toContain("agent pipeline");
    expect(doc.meta.description).toContain("usebento.ai");
    expect(doc.meta.description).not.toMatch(/[—–]/);
    // Only the question guide sets a heading; the others use their label.
    expect(listDocs().filter((entry) => entry.heading).map((entry) => entry.slug)).toEqual([
      "handoff-artifacts",
    ]);
  });

  it("opens the handoff guide with a direct answer of about 60 words", () => {
    const { content, meta } = getDoc("handoff-artifacts")!;
    const [heading, answer] = content.split(/\n\n+/);

    expect(heading).toBe(`# ${meta.heading}`);
    const words = answer.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(50);
    expect(words).toBeLessThanOrEqual(70);
    expect(answer).toContain("handoff artifact");
    expect(answer).toContain("not a chat dump");
    expect(answer).toContain("agent pipeline");
    expect(answer).toContain("usebento.ai");
    expect(answer).toContain("docs/bento/<stage>.md");
  });

  it("shows the real path pattern and the restart-from-files test", () => {
    const { content } = getDoc("handoff-artifacts")!;

    expect(content).toMatch(/^## The path pattern$/m);
    expect(content).toContain("docs/bento/implementation.md");
    expect(content).toMatch(/^## The restart-from-files test$/m);
    expect(content).toContain("stage prompt and a compacted transcript");
  });

  it("links the handoff guide to pricing, signup, and the deep guides", () => {
    const { content } = getDoc("handoff-artifacts")!;

    for (const href of [
      "(/pricing)",
      "(https://app.usebento.ai/)",
      "(/docs/concepts)",
      "(/docs/concepts#cards-sandboxes-and-worktrees)",
      "(/docs/pipeline)",
      "(/docs/pipeline#gates)",
      "(/docs/agents)",
      "(/docs/pull-requests)",
      "(/docs/pull-requests#stage-artifacts-in-pull-requests)",
      "(/docs/web-app)",
    ]) {
      expect(content).toContain(href);
    }
    expect(content).not.toMatch(/[—–]/);
  });

  it("carries on-page questions only on the handoff guide", () => {
    const withQuestions = listDocs().filter((doc) => doc.questions);

    expect(withQuestions.map((doc) => doc.slug)).toEqual(["handoff-artifacts"]);
    for (const question of withQuestions[0].questions!) {
      expect(question.title).toMatch(/\?$/);
      expect(question.body).not.toMatch(/[—–]/);
    }
  });
});
