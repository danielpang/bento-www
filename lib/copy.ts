export const siteName = "Bento";

export const siteHeadlineLines = [
  "Automate your software",
  "development lifecycle",
] as const;

export const siteHeadline = `${siteHeadlineLines[0]} ${siteHeadlineLines[1]}`;

export const siteDescription =
  "Build features by coordinating agents across your development pipeline, step in when your judgment is needed.";

export const siteTitle = `${siteName} | ${siteHeadline}`;

export const siteImageAlt = `${siteName}. ${siteHeadline}.`;

export const siteDomain = "usebento.ai";

/**
 * Several unrelated products are called Bento, and searches for them land
 * here. This one sentence names the ones people mix up and says which Bento
 * this is, so an answer engine can tell within a line. It is for machines
 * only: /llms.txt quotes it and the JSON-LD carries it as
 * disambiguatingDescription, but no page shows it to visitors.
 */
export const siteDisambiguation = `Not to be confused with Bento the email platform (bentonow) or getbento.sh: this is Bento the agent pipeline for coding agents, at ${siteDomain}.`;

export const marketingHomeHeadlineLines = [
  "Your agents.",
  "One shipping team.",
] as const;

export const marketingHomeHeadline = `${marketingHomeHeadlineLines[0]} ${marketingHomeHeadlineLines[1]}`;

export const marketingHomePromise =
  "An agent pipeline with human gates — context as artifacts, not chat dumps. usebento.ai";

export const marketingProblemHeading =
  "Bring agents into your existing software development lifecycle";

export const marketingProblemBeats = [
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
] as const;
