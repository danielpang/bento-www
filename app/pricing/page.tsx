import { PricingPlans } from "@/components/pricing-plans";
import { SiteFooter } from "@/components/site-footer";

import { pageMetadata } from "@/lib/metadata";

import { MarketingHeader } from "@/components/marketing/header";
import { money, pricingPlans } from "@/lib/pricing";
import { siteConfig } from "@/lib/site";

const pro = pricingPlans.find((plan) => plan.id === "pro")!;
const business = pricingPlans.find((plan) => plan.id === "business")!;
const enterprise = pricingPlans.find((plan) => plan.id === "enterprise")!;

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Start free, then pick a monthly plan as your pipeline grows. Seats for people on the team, pooled agent hours, and a price you can read.",
  path: "/pricing",
});

const questions = [
  {
    title: "How does a billing month work?",
    body: "Hosted Bento is billed monthly. Each team's month starts on its signup or subscription anniversary, not the first of the calendar month.",
  },
  {
    title: "What is an agent hour?",
    body: "Agent hours are sandbox time agents spend working. They are pooled for the whole team, whatever the headcount.",
  },
  {
    title: "What happens when the hours run out?",
    body: `Free pauses new runs until the next month. Paid plans can keep going at the overage rate on the plan: ${money(pro.overageUsdPerAgentHour!)} an agent hour on Pro, ${money(business.overageUsdPerAgentHour!)} on Business, ${money(enterprise.overageUsdPerAgentHour!)} on Enterprise.`,
  },
  {
    title: "What does a seat include?",
    body: `A seat is a person on the team, including open invitations. Pro bills each seat. Business bills at least ${business.minimumSeats}. Enterprise bills at least ${enterprise.minimumSeats}. Model usage is billed by your provider. Bento records spend when a tool reports it.`,
  },
  {
    title: "Can we self-host instead?",
    body: "Yes. The source license lets you run Bento for your own team. Hosted billing does not apply, and you keep the same agents, gates, and board.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="pricing-page" id="main-content">
        <header className="site-shell pricing-header">
          <p className="section-eyebrow">Pricing</p>
          <h1>
            <span>Start free.</span>{" "}
            <span>Scale the pipeline.</span>
          </h1>
          <p className="pricing-lead">
            Seats are the people on the team. Hours are the sandbox time
            agents spend working. Begin on Free, then pick a plan as the
            board fills up.
          </p>
        </header>

        <section
          aria-label="Plans"
          className="site-shell pricing-plans-section"
        >
          <PricingPlans signupUrl={siteConfig.signupUrl} />
        </section>

        <section className="site-shell pricing-aside">
          <p>
            Prefer to run it yourself? Self-host under the{" "}
            <a href="/license">source license</a>
            {siteConfig.githubUrl ? (
              <>
                {" "}
                from the{" "}
                <a
                  href={siteConfig.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub project
                </a>
              </>
            ) : (
              " GitHub project"
            )}
            . Model API keys stay yours on every plan.
          </p>
        </section>

        <section className="site-shell pricing-faq">
          <h2>Questions</h2>
          <dl>
            {questions.map((question) => (
              <div key={question.title}>
                <dt>{question.title}</dt>
                <dd>{question.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter
        hideCtaArrows
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </div>
  );
}
