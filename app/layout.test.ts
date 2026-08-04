import { describe, expect, it, vi } from "vitest";

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
});
