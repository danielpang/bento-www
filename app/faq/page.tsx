import { MarketingHeader } from "@/components/marketing/header";
import { ProductFaq } from "@/components/product-faq";
import { SiteFooter } from "@/components/site-footer";
import { faqDescription } from "@/lib/faq";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "FAQ",
  description: faqDescription,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="marketing-page">
      <MarketingHeader />
      <main className="faq-page" id="main-content">
        <header className="site-shell faq-header">
          <p className="section-eyebrow">FAQ</p>
          <h1>Questions</h1>
          <p className="faq-lead">{faqDescription}</p>
        </header>
        <section aria-label="Questions" className="site-shell faq-section faq-page-questions">
          <ProductFaq />
        </section>
      </main>
      <SiteFooter
        hideCtaArrows
        githubUrl={siteConfig.githubUrl}
        signupUrl={siteConfig.signupUrl}
      />
    </div>
  );
}
