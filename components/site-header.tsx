import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { BrandLockup } from "./brand-lockup";
import { CtaLink } from "./cta-link";

interface SiteHeaderProps {
  githubUrl: string | null;
  signupUrl: string | null;
}

const navigation = [
  { href: "/#product", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#security", label: "Security" },
];

export function SiteHeader({ githubUrl, signupUrl }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <BrandLockup />
        <nav aria-label="Primary" className="primary-navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <CtaLink
            aria-label="GitHub"
            href={githubUrl}
            rel="noreferrer"
            target="_blank"
            variant="quiet"
          >
            <GithubLogo aria-hidden="true" size={17} weight="fill" />
            <span className="github-label">GitHub</span>
          </CtaLink>
          <CtaLink href={signupUrl}>
            Sign up
            <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
