import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { siteConfig } from "@/lib/site";

interface ChangelogShellProps {
  children: ReactNode;
}

export function ChangelogShell({ children }: ChangelogShellProps) {
  return (
    <>
      <SiteHeader
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
      <main className="changelog-page">
        <div className="site-shell changelog-shell">{children}</div>
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        showFinalCta={false}
        signupUrl={siteConfig.signupUrl}
      />
    </>
  );
}
