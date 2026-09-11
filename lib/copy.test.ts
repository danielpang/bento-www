import { describe, expect, it } from "vitest";
import {
  marketingAgentsLabel,
  marketingHomeHeadline,
  marketingHomeHeadlineLines,
  marketingHomePromise,
  marketingProblemBeats,
  marketingProblemHeading,
  marketingProblemLead,
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
      "An agent pipeline that orchestrates coding agents from idea to pull request. Track all your open features while keeping the context.",
    );
    expect(marketingAgentsLabel).toBe(
      "Works with your favourite harnesses and models",
    );
    expect(marketingProblemHeading).toBe(
      "Bring agents into your existing software development lifecycle",
    );
    expect(marketingProblemLead).toContain("shares one board");
    expect(marketingProblemBeats).toEqual([
      {
        title: "Keep track of all your coding agent sessions",
        body: "Every engineer has multiple coding agent sessions going, and it is easy to lose track and sight of them. One board keeps every sessions’ status trackable",
      },
      {
        title: "Build your process into a pipeline",
        body: "You already have a process you want the agent to follow: product investigation, design, spec, implementation, code review, QA. Today you have to prompt each step by hand.",
      },
      {
        title: "Sessions shared and reviewable by the whole team",
        body: "Run your agents in isolated sandboxes. Pick up and resume work from any device and share context with your team",
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
