import { siteDomain, siteName } from "@/lib/copy";
import type { FaqEntry } from "@/lib/structured-data";

/** The /faq page description, shared by its metadata, lead, and /llms.txt. */
export const faqDescription =
  "What Bento is, which coding agents it runs, how work moves between them, and where it happens.";

/**
 * The product questions shown on /faq and published there as FAQPage
 * structured data. Each answer restates what the homepage and docs already
 * say (concepts, agents, security), so the FAQ can never claim more than
 * the pages it draws on. Pricing questions live with /pricing.
 */
export const productFaq: readonly FaqEntry[] = [
  {
    title: `What is ${siteName} (${siteDomain})?`,
    body: `${siteName} is an agent pipeline for software teams. Each feature is a card that moves through the stages you define, and every stage pairs a coding agent such as Claude Code, Codex CLI, or Cursor CLI with a model and a skill that describes the outcome you expect. Every stage starts with a manual gate for a person to review, approve, or steer, each feature runs in its own sandbox, and finished work is published as a pull request on GitHub.`,
  },
  {
    title: `Is this the same ${siteName} as bentonow or getbento.sh?`,
    body: `No. ${siteName} at ${siteDomain} is an agent pipeline for coding agents. It is not affiliated with ${siteName} the email platform (bentonow), getbento.sh, or any other product named ${siteName}.`,
  },
  {
    title: "Can one coding agent hand a feature to a different one?",
    body: "Yes. Stages hand context to each other through write-ups committed alongside the code, so a feature designed by Claude Code can be implemented by Cursor CLI or Codex CLI, and the next agent starts with what the last one learned.",
  },
  {
    title: `Which coding agents does ${siteName} support?`,
    body: "Claude Code, Codex CLI, Cursor CLI, Antigravity, DeepSeek, OpenCode, Pi, and Poolside. Each stage names the agent and model it runs, and model API keys stay with your team on every plan.",
  },
  {
    title: "Where do the agents run?",
    body: "Each feature gets its own sandboxed environment with per-feature worktrees, and no host SSH keys or host git configuration inside it. Self-host with Docker, or use a shared board with code and agents running on your own machine.",
  },
];
