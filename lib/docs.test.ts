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
      "clients",
    ]);
    expect(getDoc("pipeline")?.content).toMatch(/# Pipelines/);
    expect(getDoc("architecture")).toBeNull();
    expect(getDoc("database-schema")).toBeNull();
  });
});
