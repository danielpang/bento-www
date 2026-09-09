import { describe, expect, it } from "vitest";
import { siteDescription } from "./copy";
import { pricingPlans } from "./pricing";
import { makeSiteConfig } from "./site";
import { faqPageJsonLd, siteJsonLd } from "./structured-data";

const config = makeSiteConfig({
  NEXT_PUBLIC_SITE_URL: "https://usebento.ai",
  NEXT_PUBLIC_GITHUB_URL: "https://github.com/danielpang/bento",
  NEXT_PUBLIC_SIGNUP_URL: "https://app.usebento.ai",
});

type Node = Record<string, unknown>;

function graph(): Node[] {
  return siteJsonLd(config)["@graph"] as Node[];
}

function node(type: string): Node {
  const found = graph().find((entry) => entry["@type"] === type);
  if (!found) throw new Error(`no ${type} node`);
  return found;
}

describe("site JSON-LD", () => {
  it("describes the organization with the public GitHub project", () => {
    const organization = node("Organization");
    expect(organization).toMatchObject({
      name: "Bento",
      url: "https://usebento.ai",
      email: "daniel@usebento.ai",
      sameAs: ["https://github.com/danielpang/bento"],
    });
    expect((organization.logo as Node).url).toBe(
      "https://usebento.ai/android-chrome-512x512.png",
    );
  });

  it("describes the product with the same description as the meta tag", () => {
    const software = node("SoftwareApplication");
    expect(software).toMatchObject({
      name: "Bento",
      url: "https://usebento.ai",
      description: siteDescription,
      applicationCategory: "DeveloperApplication",
      installUrl: config.signupUrl,
      releaseNotes: "https://usebento.ai/changelog",
    });
    expect((software.softwareHelp as Node).url).toBe("https://usebento.ai/docs");
    expect(software.author).toEqual({ "@id": "https://usebento.ai/#organization" });
  });

  it("lists offers straight from the pricing catalog", () => {
    const offers = node("SoftwareApplication").offers as Node[];
    const priced = pricingPlans.filter((plan) => plan.amountUsd !== null);
    expect(offers.map((offer) => offer.name)).toEqual(priced.map((plan) => plan.name));

    const free = offers.find((offer) => offer.name === "Free")!;
    expect(free).toMatchObject({ price: 0, priceCurrency: "USD" });

    const pro = offers.find((offer) => offer.name === "Pro")!;
    expect(pro).toMatchObject({ price: 29, priceCurrency: "USD" });
    expect(pro.priceSpecification).toMatchObject({ unitText: "seat per month" });

    // "From $110" is a floor, so the offer carries minPrice and no fixed price.
    const enterprise = offers.find((offer) => offer.name === "Enterprise")!;
    expect(enterprise.price).toBeUndefined();
    expect(enterprise.priceSpecification).toMatchObject({ minPrice: 110 });
  });

  it("omits sameAs entries when no GitHub URL is configured", () => {
    const withoutGithub = makeSiteConfig({ NEXT_PUBLIC_SITE_URL: "https://usebento.ai" });
    const organization = (siteJsonLd(withoutGithub)["@graph"] as Node[]).find(
      (entry) => entry["@type"] === "Organization",
    )!;
    expect(organization.sameAs).toEqual([]);
  });
});

describe("FAQ JSON-LD", () => {
  it("mirrors the questions it is given", () => {
    const data = faqPageJsonLd([
      { title: "What is an agent hour?", body: "Sandbox time agents spend working." },
    ]);
    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an agent hour?",
          acceptedAnswer: { "@type": "Answer", text: "Sandbox time agents spend working." },
        },
      ],
    });
  });
});
