import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { MarketingHeader } from "./marketing/header";
import { siteConfig } from "@/lib/site";

interface ChangelogShellProps {
  children: ReactNode;
}

export function ChangelogShell({ children }: ChangelogShellProps) {
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="changelog-page" id="main-content">
        <div className="site-shell changelog-shell">{children}</div>
      </main>
      <SiteFooter
        githubUrl={siteConfig.githubUrl}
        showFinalCta={false}
        signupUrl={siteConfig.signupUrl}
      />
    </div>
  );
}
