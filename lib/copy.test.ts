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
    expect(siteTitle).toBe(`${siteName} | Multi-agent SDLC pipeline for coding agents`);
    expect(siteImageAlt).toBe(`${siteName}. ${siteHeadline}.`);
    expect(siteDescription).toMatch(/multi-agent SDLC/i);
    expect(siteDescription).toMatch(/context/i);
  });

  it("reuses the canonical headline in the redesigned homepage", () => {
    expect(marketingHomeHeadlineLines).toBe(siteHeadlineLines);
    expect(marketingHomeHeadline).toBe(siteHeadline);
    expect(marketingHomePromise).toBe(
      "An agent pipeline that orchestrates coding agents from idea to pull request. One card, one branch, one sandbox: stage write-ups stay with the feature so the next agent reads files, not last night's chat.",
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
    expect(siteDisambiguation).toContain("bentolabs.ai");
    expect(siteDisambiguation).toMatch(/human gates/i);
    expect(siteDisambiguation).toContain(siteDomain);
    // One sentence, so every surface can quote it whole.
    expect(siteDisambiguation.match(/[.!?](\s|$)/g)).toHaveLength(1);
    expect(siteDisambiguation).not.toMatch(/[—–]/);
  });
});
