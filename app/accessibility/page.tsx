import { CtaLink } from "@/components/cta-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Accessibility",
  description: "How Bento approaches an accessible product experience.",
  path: "/accessibility",
  socialTitle: "Accessibility at Bento",
});

export default function AccessibilityPage() {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="accessibility-page">
        <article className="site-shell accessibility-content">
          <h1>Accessibility at Bento</h1>
          <p className="accessibility-lead">
            Bento is designed to work with a keyboard and assistive
            technology, across both light and dark system themes.
          </p>

          <section>
            <h2>What we support</h2>
            <ul>
              <li>Keyboard access to navigation, controls, and pipeline actions.</li>
              <li>Visible focus, semantic structure, and descriptive control names.</li>
              <li>Reduced motion behavior that keeps every workflow understandable.</li>
            </ul>
          </section>

          <section>
            <h2>Help us improve</h2>
            <p>
              If something gets in your way, share the workflow, browser,
              and assistive technology involved in the GitHub project.
            </p>
            <CtaLink
              href={siteConfig.githubUrl}
              rel="noreferrer"
              target="_blank"
              variant="secondary"
            >
              Open GitHub
            </CtaLink>
          </section>
        </article>
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </>
  );
}
