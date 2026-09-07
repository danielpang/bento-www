import { describe, expect, it } from "vitest";
import { siteDescription, siteHeadlineLines, siteName } from "@/lib/copy";
import { SocialCard } from "./social-card";

function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join("");
  }

  if (typeof node === "object" && "props" in node) {
    return collectText((node as { props?: { children?: unknown } }).props?.children);
  }

  return "";
}

describe("social card", () => {
  it("shows the logo wordmark and the current landing slogan", () => {
    const text = collectText(SocialCard());

    expect(text).toContain(siteName);
    expect(text).toContain(siteHeadlineLines[0]);
    expect(text).toContain(siteHeadlineLines[1]);
    expect(text).toContain(siteDescription);
    expect(text).not.toMatch(/Orchestrate the whole build/i);
    expect(text).not.toMatch(/One pipeline for every agent/i);
  });

  it("shows the product lifecycle instead of a decorative underline", () => {
    const text = collectText(SocialCard());

    expect(text).toContain("Product");
    expect(text).toContain("Design");
    expect(text).toContain("Spec");
    expect(text).toContain("Implementation");
    expect(text).toContain("Review");
    expect(text).toContain("QA");
    expect(text).not.toContain("Discover");
    expect(text).not.toContain("Verify");
  });
});
