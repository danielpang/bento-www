import { describe, expect, it } from "vitest";
import { changelogEntries } from "@/lib/changelog";
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

  it("publishes the marketing, docs, changelog, and legal pages", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    // The homepage is written exactly as the canonical link renders it.
    expect(urls).toContain("http://localhost:3000");
    expect(urls).not.toContain("http://localhost:3000/");
    expect(urls).toContain("http://localhost:3000/docs");
    expect(urls).toContain("http://localhost:3000/changelog");
    expect(urls).toContain("http://localhost:3000/pricing");
    expect(urls).toContain("http://localhost:3000/terms");
    expect(urls).toContain("http://localhost:3000/license");
    expect(urls).not.toContain("http://localhost:3000/accessibility");

    for (const doc of listDocs()) {
      expect(urls).toContain(`http://localhost:3000/docs/${doc.slug}`);
    }

    // Each changelog entry is listed once, under its descriptive slug only.
    for (const entry of changelogEntries) {
      const url = `http://localhost:3000/changelog/${entry.slug}`;
      expect(urls).toContain(url);
      expect(entries.find((item) => item.url === url)?.lastModified).toBe(entry.date);
      expect(urls).not.toContain(`http://localhost:3000/changelog/${entry.date}`);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });
});
