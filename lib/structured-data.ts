import { siteDescription, siteName } from "@/lib/copy";
import { socialImagePath, socialImageSize } from "@/lib/metadata";
import { pricingPlans, type PricingPlan } from "@/lib/pricing";
import { absoluteUrl, salesMailto, siteConfig } from "@/lib/site";

type SiteConfig = typeof siteConfig;

/**
 * Every fact here is read from the copy and catalog the pages already render,
 * so structured data can never say something the visible page does not.
 */
export function siteJsonLd(config: SiteConfig = siteConfig) {
  const home = absoluteUrl("/", config.siteUrl);
  const organizationId = `${home}/#organization`;
  const sameAs = config.githubUrl ? [config.githubUrl] : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: home,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/android-chrome-512x512.png", config.siteUrl),
          width: 512,
          height: 512,
        },
        email: salesMailto.replace(/^mailto:/, ""),
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${home}/#website`,
        url: home,
        name: siteName,
        description: siteDescription,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${home}/#software`,
        name: siteName,
        url: home,
        description: siteDescription,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        image: {
          "@type": "ImageObject",
          url: absoluteUrl(socialImagePath, config.siteUrl),
          width: socialImageSize.width,
          height: socialImageSize.height,
        },
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        softwareHelp: {
          "@type": "CreativeWork",
          url: absoluteUrl("/docs", config.siteUrl),
        },
        releaseNotes: absoluteUrl("/changelog", config.siteUrl),
        license: absoluteUrl("/license", config.siteUrl),
        ...(config.signupUrl ? { installUrl: config.signupUrl } : {}),
        sameAs,
        offers: pricingPlans
          .filter((plan) => plan.amountUsd !== null)
          .map((plan) => planOffer(plan, config)),
      },
    ],
  };
}

function planOffer(plan: PricingPlan, config: SiteConfig) {
  const amount = plan.amountUsd as number;
  const unitText = plan.perSeat ? "seat per month" : "month";
  const priceSpecification = plan.fromPrice
    ? {
        "@type": "UnitPriceSpecification",
        minPrice: amount,
        priceCurrency: "USD",
        unitText,
      }
    : {
        "@type": "UnitPriceSpecification",
        price: amount,
        priceCurrency: "USD",
        unitText,
      };

  return {
    "@type": "Offer",
    name: plan.name,
    description: plan.summary,
    url: absoluteUrl("/pricing", config.siteUrl),
    priceCurrency: "USD",
    // A "from" price is a floor, not a price, so it lives only on the specification.
    ...(plan.fromPrice ? {} : { price: amount }),
    priceSpecification,
  };
}

export interface FaqEntry {
  title: string;
  body: string;
}

export function faqPageJsonLd(questions: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((question) => ({
      "@type": "Question",
      name: question.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: question.body,
      },
    })),
  };
}
