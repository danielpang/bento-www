import { describe, expect, it } from "vitest";
import {
  marketingHomeHeadline,
  marketingHomePromise,
  marketingProblemBeats,
  marketingProblemHeading,
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

  it("locks the redesigned homepage problem framing", () => {
    expect(marketingHomeHeadline).toBe(
      "Agents near your repo need a place for judgment.",
    );
    expect(marketingHomePromise).toBe(
      "An agent pipeline with human gates — context as artifacts, not chat dumps. usebento.ai",
    );
    expect(marketingProblemHeading).toBe("Why the board exists.");
    expect(marketingProblemBeats).toEqual([
      {
        title: "Chat dumps lose context",
        body: "Stage write-ups should be committed artifacts the next agent can read — not a scrollback nobody trusts.",
      },
      {
        title: "Autonomy without a gate is an unsupervised intern with merge access",
        body: "Every stage starts manual. Automate only when requirements can decide.",
      },
      {
        title: "The sandbox is the boundary",
        body: "One card, one branch, one environment. Credentials stay with trusted services.",
      },
    ]);
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
