import type { Metadata } from "next";
import { PricingPlans } from "@/components/pricing-plans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Monthly pricing for hosted Bento. Seats for people on the team, pooled agent hours, and a plan that scales with you.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | Bento",
    description:
      "Monthly pricing for hosted Bento. Seats for people on the team, pooled agent hours, and a plan that scales with you.",
    type: "website",
    url: "/pricing",
  },
};

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
    body: "Free pauses new runs until the next month. Pro and Business can stop, or keep going at $2 an agent hour with a ceiling you set so the bill cannot more than double unless you raise it.",
  },
  {
    title: "What does a seat include?",
    body: "A seat is a person on the team, including open invitations. Pro bills each seat. Business bills at least five. Model usage is billed by your provider. Bento records spend when a tool reports it.",
  },
  {
    title: "Can we self-host instead?",
    body: "Yes. The source license lets you run Bento for your own team. Hosted billing does not apply, and you keep the same agents, gates, and board.",
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="pricing-page">
        <header className="site-shell pricing-header">
          <p className="section-eyebrow">Pricing</p>
          <h1>Hosted Bento, billed monthly.</h1>
          <p className="pricing-lead">
            Seats are the people on the team. Hours are the sandbox time
            agents spend working. Start on Free, then pay for the seats
            and hours you need.
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
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </>
  );
}
