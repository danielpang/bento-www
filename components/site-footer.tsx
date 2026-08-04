import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { BrandLockup } from "./brand-lockup";
import { CtaLink } from "./cta-link";
import { Reveal } from "./reveal";

interface SiteFooterProps {
  githubUrl: string | null;
  signupUrl: string | null;
}

export function SiteFooter({ githubUrl, signupUrl }: SiteFooterProps) {
  return (
    <>
      <section className="final-cta">
        <Reveal className="site-shell final-cta-inner">
          <div>
            <h2>Give every feature a clear next step.</h2>
            <p>
              Start with manual gates. Automate each stage when the work
              earns your trust.
            </p>
          </div>
          <div className="final-cta-actions">
            <CtaLink href={signupUrl}>
              Sign up
              <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
            </CtaLink>
            <CtaLink
              href={githubUrl}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              <GithubLogo aria-hidden="true" size={17} weight="fill" />
              GitHub
            </CtaLink>
          </div>
        </Reveal>
      </section>
      <footer className="site-footer">
        <div className="site-shell footer-inner">
          <BrandLockup />
          <nav aria-label="Footer" className="footer-links">
            <CtaLink
              href={githubUrl}
              rel="noreferrer"
              target={githubUrl ? "_blank" : undefined}
              variant="quiet"
            >
              GitHub
            </CtaLink>
            <CtaLink href="/docs" variant="quiet">
              Documentation
            </CtaLink>
            <CtaLink href="/license" variant="quiet">
              License
            </CtaLink>
            <CtaLink href="/terms" variant="quiet">
              Terms
            </CtaLink>
          </nav>
          <p>Built for teams that want agents moving and humans steering.</p>
        </div>
      </footer>
    </>
  );
}
