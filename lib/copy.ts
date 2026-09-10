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
