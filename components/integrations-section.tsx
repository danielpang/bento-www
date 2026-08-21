import { ArrowUpRight, SlackLogo } from "@phosphor-icons/react/dist/ssr";
import { slackInstallUrl } from "@/lib/site";
import { CtaLink } from "./cta-link";
import { Reveal } from "./reveal";

function LinearLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" />
    </svg>
  );
}

const linearSteps = [
  "A Linear task is created",
  "Bento opens a feature card",
  "The pipeline starts",
] as const;

const slackSteps = [
  "Message @bento to create a card",
  "The pipeline starts",
  "Approve the gate in Slack",
  "Read the agent output there",
] as const;

export function IntegrationsSection() {
  return (
    <section className="section integrations-section" id="integrations">
      <div className="site-shell">
        <Reveal className="section-heading">
          <span className="section-eyebrow">Integrations</span>
          <h2>Start a card from Linear or Slack.</h2>
          <p>
            Kick off a feature in the tools your team already uses, then let
            Bento run the pipeline.
          </p>
        </Reveal>

        <div className="integrations-grid">
          <Reveal className="integration-card">
            <div className="cell-icon">
              <LinearLogo className="integration-logo" />
            </div>
            <h3>Linear</h3>
            <p>
              Tasks created in Linear can automatically create a feature card
              in Bento and start the pipeline.
            </p>
            <ol aria-label="Linear integration flow" className="integration-flow">
              {linearSteps.map((step, index) => (
                <li key={step}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="integration-card integration-card-slack" delay={0.06}>
            <div className="cell-icon">
              <SlackLogo aria-hidden="true" size={22} weight="duotone" />
            </div>
            <h3>Slack</h3>
            <p>
              Message <code>@bento</code> to create a card and start the
              pipeline. Approve in Slack and see agent output.
            </p>
            <div className="integration-footer">
              <ol aria-label="Slack integration flow" className="integration-flow">
                {slackSteps.map((step, index) => (
                  <li key={step}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="integration-install">
                <span className="integration-install-note">
                  One-click install
                </span>
                <CtaLink
                  href={slackInstallUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Add to Slack
                  <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
