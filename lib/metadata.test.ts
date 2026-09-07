import { describe, expect, it } from "vitest";
import { siteImageAlt } from "./copy";
import { pageMetadata, socialImage, socialImagePath } from "./metadata";

describe("social image", () => {
  it("describes the shared card at the standard large-card size", () => {
    expect(socialImage).toEqual({
      alt: siteImageAlt,
      height: 630,
      type: "image/png",
      url: socialImagePath,
      width: 1200,
    });
    expect(socialImagePath).toMatch(/\.png$/);
  });
});

describe("pageMetadata", () => {
  it("builds canonical, Open Graph, and X card metadata with the image", () => {
    const metadata = pageMetadata({
      title: "Pricing",
      description: "Plans.",
      path: "/pricing",
    });

    expect(metadata).toEqual({
      title: "Pricing",
      description: "Plans.",
      alternates: { canonical: "/pricing" },
      openGraph: {
        title: "Pricing | Bento",
        description: "Plans.",
        type: "website",
        url: "/pricing",
        images: [socialImage],
      },
      twitter: {
        card: "summary_large_image",
        title: "Pricing | Bento",
        description: "Plans.",
        images: [socialImage],
      },
    });
  });

  it("accepts a custom social title and article type", () => {
    const metadata = pageMetadata({
      title: "Pipelines",
      description: "How pipelines run.",
      path: "/docs/pipelines",
      socialTitle: "Pipelines | Bento docs",
      type: "article",
    });

    expect(metadata.title).toBe("Pipelines");
    expect(metadata.openGraph).toMatchObject({
      title: "Pipelines | Bento docs",
      type: "article",
    });
    expect(metadata.twitter).toMatchObject({
      title: "Pipelines | Bento docs",
    });
  });
});
