import { describe, expect, it } from "vitest";
import {
  marketingHomeHeadline,
  marketingHomeHeadlineLines,
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
    expect(marketingHomeHeadlineLines).toEqual([
      "Your agents.",
      "One shipping team.",
    ]);
    expect(marketingHomeHeadline).toBe("Your agents. One shipping team.");
    expect(marketingHomePromise).toBe(
      "An agent pipeline with human gates — context as artifacts, not chat dumps. usebento.ai",
    );
    expect(marketingProblemHeading).toBe(
      "Bring agents into your existing software development lifecycle",
    );
    expect(marketingProblemBeats).toEqual([
      {
        title: "Multiple sessions lose context",
        body: "Every engineer has several coding agent sessions going, and it is easy to lose the thread or forget the state of each one. One board keeps every session visible to the team.",
      },
      {
        title: "Each step still needs a manual prompt",
        body: "You already have a process you want the agent to follow: product investigation, design, spec, implementation, code review, QA. Today you have to prompt each step by hand.",
      },
      {
        title: "Laptop agents cannot be shared",
        body: "Agents run on a laptop, so they cannot be accessed remotely or shared with teammates.",
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
