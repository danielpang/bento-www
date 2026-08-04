import type { MetadataRoute } from "next";
import { listDocs } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = listDocs().map((doc) => ({
    changeFrequency: "monthly" as const,
    priority: 0.6,
    url: new URL(`/docs/${doc.slug}`, siteConfig.siteUrl).toString(),
  }));

  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: siteConfig.siteUrl.toString(),
    },
    {
      changeFrequency: "weekly",
      priority: 0.8,
      url: new URL("/docs", siteConfig.siteUrl).toString(),
    },
    ...docs,
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: new URL("/terms", siteConfig.siteUrl).toString(),
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: new URL("/license", siteConfig.siteUrl).toString(),
    },
  ];
}
