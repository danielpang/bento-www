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
  "An agent pipeline that orchestrates coding agents from idea to pull request. Track all your open features while keeping the context.";

export const marketingAgentsLabel = "Works with your favourite harnesses and models";

export const marketingProblemHeading =
  "Bring agents into your existing software development lifecycle";

export const marketingProblemLead =
  "Coordinate agents across many features at once. Your team shares one board, so progress and context stay visible.";

export const marketingProblemBeats = [
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
    body: "Agents run on a laptop, so they cannot be accessed remotely or shared with teammates.",
  },
] as const;

export const marketingBoardCaption = "Team board";
export const marketingBoardCaptionMeta = "Visible to the team";

export const marketingPipelineLanes = [
  { stage: "Product investigation", title: "Checkout recovery", state: "running", label: "agent working" },
  { stage: "UI/UX design", title: "Billing empty states", state: "idle", label: "in review" },
  { stage: "Engineering requirements", title: "Usage-based billing", state: "idle", label: "not started" },
  { stage: "Implementation", title: "Move audit log off hot path", state: "running", label: "agent working" },
  { stage: "Code review", title: "Rate limit the public API", state: "gated", label: "waiting at gate" },
  { stage: "Quality engineering", title: "Retry timed-out webhooks", state: "done", label: "done" },
] as const;

export const marketingShareLocalTitle = "On a laptop";
export const marketingShareLocalBody = "Private to one machine";
export const marketingShareRemoteTitle = "On the board";
export const marketingShareRemoteBody = "Remote, and visible to teammates";
