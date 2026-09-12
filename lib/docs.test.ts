import { describe, expect, it } from "vitest";
import { getDoc, listDocs } from "./docs";

describe("docs catalog", () => {
  it("exposes the copied Bento guides in a stable order", () => {
    const docs = listDocs();

    expect(docs.map((doc) => doc.slug)).toEqual([
      "concepts",
      "pipeline",
      "agents",
      "pull-requests",
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

  it("marks up only the question the pipeline guide visibly asks and answers", () => {
    const withQuestions = listDocs().filter((doc) => doc.questions);
    expect(withQuestions.map((doc) => doc.slug)).toEqual(["pipeline"]);

    const { content, meta } = getDoc("pipeline")!;
    const plain = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    for (const question of meta.questions!) {
      expect(question.title).toMatch(/\?$/);
      expect(plain).toContain(`### ${question.title}\n\n${question.body}\n`);
    }
  });
});
