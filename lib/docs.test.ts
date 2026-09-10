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

  it("frames the handoff guide as the agent pipeline at usebento.ai", () => {
    const doc = getDoc("handoff-artifacts")!;

    expect(doc.meta.title).toBe("Handoff artifacts");
    expect(doc.meta.description).toContain("agent pipeline");
    expect(doc.meta.description).toContain("usebento.ai");
    expect(doc.meta.description).not.toMatch(/[—–]/);
  });

  it("opens the handoff guide with a direct answer of 40 to 80 words", () => {
    const { content } = getDoc("handoff-artifacts")!;
    const [heading, answer] = content.split(/\n\n+/);

    expect(heading).toBe("# Handoff artifacts");
    const words = answer.trim().split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(80);
    expect(answer).toContain("agent pipeline");
    expect(answer).toContain("usebento.ai");
    expect(answer).toContain("docs/bento/<stage>.md");
  });

  it("links the handoff guide to pricing, signup, and the related guides", () => {
    const { content } = getDoc("handoff-artifacts")!;

    for (const href of [
      "(/pricing)",
      "(https://app.usebento.ai/)",
      "(/docs/concepts#cards-sandboxes-and-worktrees)",
      "(/docs/pipeline#gates)",
      "(/docs/agents)",
      "(/docs/pull-requests#stage-artifacts-in-pull-requests)",
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
