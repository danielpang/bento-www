import { List } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

const navigation = [
  { label: "Integrations", href: "/#integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
];

export function MarketingHeader() {
  return (
    <div className="marketing-header">
      <a className="marketing-skip" href="#main-content">Skip to content</a>
      <SiteHeader {...siteConfig} hideCtaArrows navigation={navigation} />
      <details className="marketing-menu">
        <summary aria-label="Navigation menu"><List size={22} /></summary>
        <nav aria-label="Mobile navigation">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </details>
    </div>
  );
}
