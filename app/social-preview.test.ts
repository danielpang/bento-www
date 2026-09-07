import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import { getDocSlugs } from "@/lib/docs";
import { socialImage } from "@/lib/metadata";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono" }),
}));

import { metadata as rootMetadata } from "./layout";
import { metadata as accessibilityMetadata } from "./accessibility/page";
import { metadata as changelogMetadata } from "./changelog/page";
import { metadata as docsMetadata } from "./docs/page";
import { generateMetadata as generateDocMetadata } from "./docs/[slug]/page";
import { metadata as licenseMetadata } from "./license/page";
import { metadata as pricingMetadata } from "./pricing/page";
import { metadata as termsMetadata } from "./terms/page";

// Next.js merges `openGraph` and `twitter` shallowly per segment, so a page
// that sets either block without images publishes a text-only link preview.
const staticRoutes: Array<[string, Metadata]> = [
  ["/", rootMetadata],
  ["/accessibility", accessibilityMetadata],
  ["/changelog", changelogMetadata],
  ["/docs", docsMetadata],
  ["/license", licenseMetadata],
  ["/pricing", pricingMetadata],
  ["/terms", termsMetadata],
];

function expectSocialImage(metadata: Metadata) {
  expect(metadata.openGraph).toMatchObject({ images: [socialImage] });
  expect(metadata.twitter).toMatchObject({
    card: "summary_large_image",
    images: [socialImage],
  });
}

describe("social link previews", () => {
  it.each(staticRoutes)("%s publishes the shared card image", (_, metadata) => {
    expectSocialImage(metadata);
  });

  it("publishes the shared card image on every doc page", async () => {
    for (const slug of getDocSlugs()) {
      expectSocialImage(
        await generateDocMetadata({ params: Promise.resolve({ slug }) }),
      );
    }
  });
});
