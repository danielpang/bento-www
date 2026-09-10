import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/marketing/header";
import { SiteFooter } from "@/components/site-footer";
import type { DocMeta } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

interface DocsShellProps {
  children: ReactNode;
  docs: DocMeta[];
  currentSlug?: string;
  title: string;
  lead?: string;
  /** A figure shown between the page header and the guide text. */
  figure?: ReactNode;
}

export function DocsShell({
  children,
  docs,
  currentSlug,
  title,
  lead,
  figure,
}: DocsShellProps) {
  // The docs share the redesigned marketing treatment so moving between the
  // homepage, pricing, changelog, and a guide never changes theme.
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="docs-page" id="main-content">
        <div className="site-shell docs-layout">
          <aside className="docs-nav" aria-label="Documentation">
            <p className="docs-nav-label">Guides</p>
            <ul>
              <li>
                <Link
                  aria-current={currentSlug ? undefined : "page"}
                  className={!currentSlug ? "is-active" : undefined}
                  href="/docs"
                >
                  Overview
                </Link>
              </li>
              {docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    aria-current={
                      currentSlug === doc.slug ? "page" : undefined
                    }
                    className={
                      currentSlug === doc.slug ? "is-active" : undefined
                    }
                    href={`/docs/${doc.slug}`}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <article className="docs-content">
            <header className="docs-header">
              <p className="section-eyebrow">Documentation</p>
              <h1>{title}</h1>
              {lead ? <p className="docs-lead">{lead}</p> : null}
            </header>
            {figure ? <div className="docs-figure">{figure}</div> : null}
            <div className="docs-body">{children}</div>
          </article>
        </div>
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        showFinalCta={false}
        signupUrl={siteConfig.signupUrl}
      />
    </div>
  );
}
