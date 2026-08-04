import { describe, expect, it } from "vitest";
import { getDoc, listDocs } from "./docs";

describe("docs catalog", () => {
  it("exposes the copied Bento guides in a stable order", () => {
    const docs = listDocs();

    expect(docs.map((doc) => doc.slug)).toEqual([
      "concepts",
      "architecture",
      "pipeline",
      "agents",
      "pull-requests",
      "web-app",
      "clients",
      "database-schema",
    ]);
    expect(getDoc("pipeline")?.content).toMatch(/# Pipelines/);
  });
});
