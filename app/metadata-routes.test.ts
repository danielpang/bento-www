import { describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

describe("metadata routes", () => {
  it("allows indexing and points crawlers at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { allow: "/", userAgent: "*" },
      sitemap: "http://localhost:3000/sitemap.xml",
    });
  });

  it("publishes the marketing home page", () => {
    expect(sitemap()).toEqual([
      {
        changeFrequency: "weekly",
        priority: 1,
        url: "http://localhost:3000/",
      },
      {
        changeFrequency: "monthly",
        priority: 0.4,
        url: "http://localhost:3000/accessibility",
      },
    ]);
  });
});
