import { ArrowRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { CtaLink } from "@/components/cta-link";
import { GateDemo } from "@/components/gate-demo";
import { HandoffSection } from "@/components/handoff-section";
import { LifecycleSection } from "@/components/lifecycle-section";
import { PipelineDemo } from "@/components/pipeline-demo";
import { Reveal } from "@/components/reveal";
import { SecuritySection } from "@/components/security-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main>
        <section className="hero">
          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <h1>
                <span>See the</span>{" "}
                <span>whole lifecycle</span>
              </h1>
              <p>
                Build features by coordinating agents across your development
                pipeline, step in when your judgment is needed.
              </p>
              <div className="hero-actions">
                <CtaLink href={siteConfig.signupUrl}>
                  Sign up
                  <ArrowRight aria-hidden="true" size={16} weight="bold" />
                </CtaLink>
                <CtaLink
                  href={siteConfig.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                  variant="secondary"
                >
                  <GithubLogo aria-hidden="true" size={17} weight="fill" />
                  GitHub
                </CtaLink>
              </div>
            </div>
            <div className="hero-visual">
              <PipelineDemo />
            </div>
          </div>
        </section>

        <LifecycleSection />

        <section className="section gate-section" id="how-it-works">
          <div className="site-shell gate-layout">
            <Reveal className="gate-copy">
              <span className="section-eyebrow">Human gates</span>
              <h2>Your judgment has a place.</h2>
              <p>
                Every stage starts manual. Make it automatic only when its
                requirements deserve to decide.
              </p>
              <dl className="trust-modes">
                <div>
                  <dt>Manual</dt>
                  <dd>You approve, reject, or steer the work.</dd>
                </div>
                <div>
                  <dt>Automatic</dt>
                  <dd>Passing requirements move the card forward.</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal className="gate-visual" delay={0.08}>
              <GateDemo />
            </Reveal>
          </div>
        </section>

        <HandoffSection />
        <SecuritySection />
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </>
  );
}
