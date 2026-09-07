import type { Metadata } from "next";
import { siteImageAlt, siteName } from "@/lib/copy";

export const socialImagePath = "/og.png";

export const socialImageSize = { height: 630, width: 1200 } as const;

/**
 * The shared link-preview card. Next.js merges `openGraph` and `twitter`
 * shallowly, so any page that sets either block must include this image
 * itself or crawlers (X, Slack, iMessage) get a text-only preview.
 */
export const socialImage = {
  alt: siteImageAlt,
  height: socialImageSize.height,
  type: "image/png",
  url: socialImagePath,
  width: socialImageSize.width,
} as const;

interface PageMetadataOptions {
  title: string;
  description: string;
  /** Path-only URL used for the canonical link and og:url. */
  path: string;
  /** Title shown on social cards. Defaults to `${title} | Bento`. */
  socialTitle?: string;
  type?: "website" | "article";
}

export function pageMetadata({
  title,
  description,
  path,
  socialTitle = `${title} | ${siteName}`,
  type = "website",
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: socialTitle,
      description,
      type,
      url: path,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}
