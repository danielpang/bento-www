import { describe, expect, it, vi } from "vitest";
import { siteDescription, siteHeadlineLines, siteImageAlt } from "@/lib/copy";

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {
    element: unknown;

    constructor(element: unknown) {
      this.element = element;
    }
  },
}));

import OpenGraphImage, { alt } from "./opengraph-image";

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

describe("open graph image", () => {
  it("renders the current landing headline instead of the retired slogan", () => {
    const image = OpenGraphImage() as unknown as { element: unknown };
    const text = collectText(image.element);

    expect(alt).toBe(siteImageAlt);
    expect(text).toContain(siteHeadlineLines[0]);
    expect(text).toContain(siteHeadlineLines[1]);
    expect(text).toContain(siteDescription);
    expect(text).not.toMatch(/Orchestrate the whole build/i);
    expect(text).not.toMatch(/One pipeline for every agent/i);
  });

  it("shows the product lifecycle instead of a decorative underline", () => {
    const image = OpenGraphImage() as unknown as { element: unknown };
    const text = collectText(image.element);

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
