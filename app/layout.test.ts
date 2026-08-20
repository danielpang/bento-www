import { describe, expect, it, vi } from "vitest";
import { siteDescription, siteName, siteTitle } from "@/lib/copy";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono" }),
}));

import { metadata } from "./layout";

describe("site metadata", () => {
  it("publishes the configured canonical URL", () => {
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({
      url: new URL("http://localhost:3000/"),
    });
  });

  it("uses the current landing headline in titles and descriptions", () => {
    expect(metadata.title).toEqual({
      default: siteTitle,
      template: `%s | ${siteName}`,
    });
    expect(metadata.description).toBe(siteDescription);
    expect(metadata.openGraph).toMatchObject({
      title: siteTitle,
      description: siteDescription,
      siteName,
    });
    expect(metadata.twitter).toMatchObject({
      title: siteTitle,
      description: siteDescription,
    });
    expect(JSON.stringify(metadata)).not.toMatch(/Orchestrate the whole build/i);
  });
});
