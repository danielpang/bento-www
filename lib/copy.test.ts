import { describe, expect, it } from "vitest";
import {
  siteDescription,
  siteDisambiguation,
  siteDomain,
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

  it("tells the other Bentos apart in one quotable sentence", () => {
    expect(siteDomain).toBe("usebento.ai");
    expect(siteDisambiguation).toContain("bentonow");
    expect(siteDisambiguation).toContain("getbento.sh");
    expect(siteDisambiguation).toContain("agent pipeline");
    expect(siteDisambiguation).toContain(siteDomain);
    // One sentence, so every surface can quote it whole.
    expect(siteDisambiguation.match(/[.!?](\s|$)/g)).toHaveLength(1);
    expect(siteDisambiguation).not.toMatch(/[—–]/);
  });
});
