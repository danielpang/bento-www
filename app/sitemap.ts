import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: siteConfig.siteUrl.toString(),
    },
    {
      changeFrequency: "monthly",
      priority: 0.4,
      url: new URL("/accessibility", siteConfig.siteUrl).toString(),
    },
  ];
}
