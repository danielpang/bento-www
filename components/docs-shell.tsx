import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { DocMeta } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

interface DocsShellProps {
  children: ReactNode;
  docs: DocMeta[];
  currentSlug?: string;
  title: string;
  lead?: string;
}

export function DocsShell({
  children,
  docs,
  currentSlug,
  title,
  lead,
}: DocsShellProps) {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="docs-page">
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
            <div className="docs-body">{children}</div>
          </article>
        </div>
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </>
  );
}
