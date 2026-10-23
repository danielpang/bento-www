import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { DocsToc } from "@/components/docs-toc";
import { MarketingHeader } from "@/components/marketing/header";
import { SiteFooter } from "@/components/site-footer";
import type { DocMeta } from "@/lib/docs";
import type { DocHeading } from "@/lib/headings";
import { siteConfig } from "@/lib/site";

interface DocsShellProps {
  children: ReactNode;
  docs: DocMeta[];
  currentSlug?: string;
  title: string;
  lead?: string;
  /** A figure shown between the page header and the guide text. */
  figure?: ReactNode;
  /** The current guide's sections, listed under it in the navigation. */
  toc?: DocHeading[];
}

interface GuideListProps {
  docs: DocMeta[];
  currentSlug?: string;
  toc?: DocHeading[];
}

function GuideList({ docs, currentSlug, toc }: GuideListProps) {
  return (
    <ul className="docs-guides">
      <li>
        <Link
          aria-current={currentSlug ? undefined : "page"}
          className={!currentSlug ? "is-active" : undefined}
          href="/docs"
        >
          Overview
        </Link>
      </li>
      {docs.map((doc) => {
        const isCurrent = currentSlug === doc.slug;
        return (
          <li key={doc.slug}>
            <Link
              aria-current={isCurrent ? "page" : undefined}
              className={isCurrent ? "is-active" : undefined}
              href={`/docs/${doc.slug}`}
            >
              {doc.title}
            </Link>
            {isCurrent && toc && toc.length > 0 ? (
              <DocsToc items={toc} label={`${doc.title} sections`} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsShell({
  children,
  docs,
  currentSlug,
  title,
  lead,
  figure,
  toc,
}: DocsShellProps) {
  const currentTitle =
    docs.find((doc) => doc.slug === currentSlug)?.title ?? "Overview";

  // The docs share the redesigned marketing treatment so moving between the
  // homepage, pricing, changelog, and a guide never changes theme.
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="docs-page" id="main-content">
        <div className="site-shell docs-layout">
          <aside className="docs-nav" aria-label="Documentation">
            {/* Desktop: a sticky sidebar that scrolls on its own. */}
            <div className="docs-nav-panel" data-docs-nav-scroll>
              <p className="docs-nav-label">Guides</p>
              <GuideList currentSlug={currentSlug} docs={docs} toc={toc} />
            </div>
            {/*
              Mobile: the same links behind one control. Keyed by guide so a
              menu left open does not stay open on the next guide.
            */}
            <details className="docs-nav-menu" key={currentSlug ?? "overview"}>
              <summary>
                <span className="docs-nav-menu-text">
                  <span className="docs-nav-label">Guides</span>
                  <span className="docs-nav-menu-current">{currentTitle}</span>
                </span>
                <CaretDown aria-hidden="true" className="docs-nav-menu-caret" size={16} />
              </summary>
              <GuideList currentSlug={currentSlug} docs={docs} toc={toc} />
            </details>
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
