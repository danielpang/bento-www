import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for Bento, including how we handle your data and code.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use | Bento",
    description:
      "Terms of use for Bento, including how we handle your data and code.",
    type: "website",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="legal-page">
        <article className="site-shell legal-content">
          <p className="section-eyebrow">Legal</p>
          <h1>Terms of Use</h1>
          <p className="legal-lead">
            These terms cover your use of the Bento website and related
            hosted services operated by Bento. By using Bento, you agree to
            them.
          </p>

          <section>
            <h2>The service</h2>
            <p>
              Bento helps teams orchestrate coding agents through product
              work. Features may change as the product develops. We may
              update these terms when we do; the dated version on this page
              is the one that applies.
            </p>
          </section>

          <section>
            <h2>Your accounts and content</h2>
            <p>
              You are responsible for the accounts you create, the
              repositories you connect, and the instructions you give to
              agents. Do not use Bento to break the law, abuse other
              systems, or violate third-party terms that apply to the tools
              and models you connect.
            </p>
          </section>

          <section>
            <h2>Data and code we do not use for training</h2>
            <p>
              We do not use your user data, prompts, repository contents,
              agent transcripts, or other customer code to train large
              language models, whether our own or a third party&apos;s.
            </p>
            <p>
              We do not sell your user data, and we do not sell your code or
              code-derived data.
            </p>
            <p>
              Models and agent tools you connect may have their own terms.
              Review those providers separately; this section describes what
              Bento itself does with your material.
            </p>
          </section>

          <section>
            <h2>Self-hosted software</h2>
            <p>
              If you run Bento yourself, the{" "}
              <a href="/license">Bento license</a> governs that software.
              These website terms still apply to bento.dev and any hosted
              service we operate.
            </p>
          </section>

          <section>
            <h2>Availability and liability</h2>
            <p>
              Bento is provided as-is. To the fullest extent allowed by law,
              we are not liable for indirect, incidental, or consequential
              damages, or for lost profits, arising from your use of the
              service. Our total liability for a claim relating to the
              service is limited to the fees you paid us for Bento in the
              twelve months before the claim, if any.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms can go through the{" "}
              {siteConfig.githubUrl ? (
                <a href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
                  GitHub project
                </a>
              ) : (
                "GitHub project"
              )}
              .
            </p>
            <p className="legal-updated">Last updated: 4 August 2026</p>
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
