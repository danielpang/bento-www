import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { BrandLockup } from "./brand-lockup";
import { CtaLink } from "./cta-link";

interface SiteHeaderProps {
  githubUrl: string | null;
  signupUrl: string | null;
  hideCtaArrows?: boolean;
  navigation?: readonly { href: string; label: string }[];
}

const defaultNavigation = [
  { href: "/#product", label: "Product" },
  { href: "/#security", label: "Security" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteHeader({
  githubUrl,
  signupUrl,
  hideCtaArrows = false,
  navigation = defaultNavigation,
}: SiteHeaderProps) {
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
            {!hideCtaArrows && <ArrowUpRight aria-hidden="true" size={15} weight="bold" />}
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
