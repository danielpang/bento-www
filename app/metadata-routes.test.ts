import { describe, expect, it } from "vitest";
import { listDocs } from "@/lib/docs";
import robots from "./robots";
import sitemap from "./sitemap";

describe("metadata routes", () => {
  it("allows indexing and points crawlers at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { allow: "/", userAgent: "*" },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });

  it("publishes the marketing, docs, and legal pages", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/");
    expect(urls).toContain("http://localhost:3000/docs");
    expect(urls).toContain("http://localhost:3000/terms");
    expect(urls).toContain("http://localhost:3000/license");
    expect(urls).not.toContain("http://localhost:3000/accessibility");

    for (const doc of listDocs()) {
      expect(urls).toContain(`http://localhost:3000/docs/${doc.slug}`);
    }
  });
});
