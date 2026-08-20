import { describe, expect, it } from "vitest";
import {
  siteDescription,
  siteHeadline,
  siteHeadlineLines,
  siteImageAlt,
  siteName,
  siteTitle,
} from "./copy";

describe("site copy", () => {
  it("uses the current landing headline instead of the retired slogan", () => {
    expect(siteHeadlineLines).toEqual([
      "Automate your software",
      "development lifecycle",
    ]);
    expect(siteHeadline).toBe(
      "Automate your software development lifecycle",
    );
    expect(siteHeadline).not.toMatch(/whole build/i);
    expect(siteTitle).toBe(`${siteName} | ${siteHeadline}`);
    expect(siteImageAlt).toBe(`${siteName}. ${siteHeadline}.`);
    expect(siteDescription).toContain("coordinating agents");
  });
});
