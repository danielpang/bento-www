import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "License",
  description:
    "Bento source license: read and self-host for your team, without offering a competing hosted service.",
  path: "/license",
});

export default function LicensePage() {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="legal-page">
        <article className="site-shell legal-content">
          <p className="section-eyebrow">Legal</p>
          <h1>Bento Source License</h1>
          <p className="legal-lead">
            You may read the source and self-host Bento for your own team.
            You may not use it to sell or operate a competing hosted
            service.
          </p>

          <section>
            <h2>1. Grant</h2>
            <p>
              Copyright (c) 2026 Bento contributors. Permission is granted,
              free of charge, to any person or organization obtaining a
              copy of this software and associated documentation files (the
              &quot;Software&quot;), to use, copy, modify, and self-host the
              Software, subject to the conditions below.
            </p>
          </section>

          <section>
            <h2>2. Allowed use</h2>
            <ul>
              <li>
                Read, study, and modify the source code for any purpose
                that does not violate Section 3.
              </li>
              <li>
                Self-host the Software for yourself, your team, or your
                company&apos;s internal use, including production use that
                serves your own employees and contractors.
              </li>
              <li>
                Distribute copies of the Software, with or without
                modification, provided each copy includes this license and
                the copyright notice.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Competing hosted service restriction</h2>
            <p>
              You may not use the Software, or a modified version of it, to
              provide a competing hosted or managed service to third
              parties. That includes offering Bento, or a substantially
              similar orchestrator derived from it, as a paid or commercial
              multi-tenant product, SaaS, or managed deployment for
              customers who are not part of your own organization.
            </p>
            <p>
              Internal self-hosting for your organization is allowed.
              Selling access to a hosted Bento-like service to other
              companies or the public is not.
            </p>
          </section>

          <section>
            <h2>4. Notices</h2>
            <p>
              Redistributions in source or binary form must retain this
              license text and the copyright notice. Modified versions
              should make clear that changes were made.
            </p>
          </section>

          <section>
            <h2>5. No trademark license</h2>
            <p>
              This license does not grant permission to use the Bento name,
              logos, or other brand assets, except as needed to describe
              the origin of the Software.
            </p>
          </section>

          <section>
            <h2>6. Disclaimer</h2>
            <p>
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY
              OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
              THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
              OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR
              OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR
              OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE
              SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </section>

          <section>
            <h2>7. Commercial exceptions</h2>
            <p>
              If you need rights beyond this license, including permission
              to offer a hosted service, contact the maintainers through
              the{" "}
              {siteConfig.githubUrl ? (
                <a href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
                  GitHub project
                </a>
              ) : (
                "GitHub project"
              )}
              .
            </p>
            <p className="legal-updated">License version: 4 August 2026</p>
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
