import { changelogEntries } from "@/lib/changelog";
import { siteDescription, siteName } from "@/lib/copy";
import { listDocs } from "@/lib/docs";
import { money, pricingPlans, planPriceLabel } from "@/lib/pricing";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * The /llms.txt one-pager, in the shape proposed at llmstxt.org: an H1, a
 * blockquote summary, short prose, then H2 sections of Markdown links, each
 * with a one-line note. Only the "## Optional" section may be skipped by a
 * reader short on context, so the essentials come before it.
 *
 * Everything below restates copy that already ships on the site or in its
 * pricing catalog and docs. Nothing is claimed here that a page does not.
 */
export function llmsTxt(config: typeof siteConfig = siteConfig): string {
  const link = (path: string, label: string, note: string) =>
    `- [${label}](${absoluteUrl(path, config.siteUrl)}): ${note}`;
  const externalLink = (url: string, label: string, note: string) =>
    `- [${label}](${url}): ${note}`;

  const plans = pricingPlans.map((plan) => {
    const seats = plan.minimumSeats > 1 ? `, ${plan.minimumSeats} seats minimum` : "";
    const price =
      plan.amountUsd === 0
        ? "$0"
        : plan.perSeat
          ? `${planPriceLabel(plan)} per seat a month${seats}`
          : planPriceLabel(plan);
    const overage = plan.overageUsdPerAgentHour
      ? `, then ${money(plan.overageUsdPerAgentHour)} an agent hour`
      : "";
    const members = plan.memberLimit ? `, up to ${plan.memberLimit} members` : "";
    return `- ${plan.name}: ${price}${members}, ${plan.includedAgentHours} agent hours a month for the team${overage}.`;
  });

  const docs = listDocs().map((doc) =>
    link(`/docs/${doc.slug}`, doc.title, doc.description),
  );

  const releases = changelogEntries
    .slice(0, 5)
    .map((entry) =>
      link(`/changelog/${entry.slug}`, `${entry.title} (${entry.displayDate})`, entry.description),
    );

  const product = [
    link("/", "Homepage", siteDescription),
    link("/docs", "Documentation", "Guides for running Bento: pipelines, agents, pull requests, and the web console."),
    link("/pricing", "Pricing", "Start free, then pick a monthly plan as your pipeline grows. Seats for people on the team, pooled agent hours."),
    link("/changelog", "Changelog", "Product updates for Bento, including coding agents, models, and integrations."),
  ];
  if (config.githubUrl) {
    product.push(externalLink(config.githubUrl, "Source code on GitHub", "The Bento repository, available to self-host under its source license."));
  }
  if (config.signupUrl) {
    product.push(externalLink(config.signupUrl, "Web console", "Sign in or create an account for hosted Bento."));
  }

  return [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    "Bento is a kanban board and orchestrator for coding agents. A feature moves through a pipeline of stages; each stage pairs a coding agent with a model and a skill that describes the outcome you expect, and each feature gets its own sandboxed environment. Stage write-ups are committed alongside the code, so the next agent starts with what the last one learned. Every stage begins with a manual gate for a person to review, approve, or steer, and a gate can be made automatic once its requirements can decide. Cards can be started from Linear or Slack, and finished work is published as a pull request on GitHub.",
    "",
    "Supported coding agents: Claude Code, Codex CLI, Cursor CLI, Antigravity, DeepSeek, OpenCode, Pi, and Poolside. Model API keys stay with your team on every plan. Bento can be self-hosted with Docker, or used as a shared board with code and agents running on your own machine.",
    "",
    "## Product",
    "",
    ...product,
    "",
    "## Docs",
    "",
    ...docs,
    "",
    "## Pricing",
    "",
    "Hosted Bento is billed monthly. Seats are the people on the team; agent hours are sandbox time agents spend working, pooled for the whole team.",
    "",
    ...plans,
    "",
    "## Recent changes",
    "",
    ...releases,
    "",
    "## Optional",
    "",
    link("/terms", "Terms of Use", "Terms of use for Bento, including how we handle your data and code."),
    link("/license", "License", "Bento source license: read and self-host for your team, without offering a competing hosted service."),
    link("/accessibility", "Accessibility", "How Bento approaches an accessible product experience."),
    "",
  ].join("\n");
}
