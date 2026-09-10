import type { MetadataRoute } from "next";
import { listDocs } from "@/lib/docs";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = listDocs().map((doc) => ({
    changeFrequency: "monthly" as const,
    priority: 0.6,
    url: absoluteUrl(`/docs/${doc.slug}`),
  }));

  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: absoluteUrl("/"),
    },
    {
      changeFrequency: "weekly",
      priority: 0.8,
      url: absoluteUrl("/docs"),
    },
    {
      changeFrequency: "weekly",
      priority: 0.6,
      url: absoluteUrl("/changelog"),
    },
    {
      changeFrequency: "weekly",
      priority: 0.8,
      url: absoluteUrl("/pricing"),
    },
    ...docs,
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: absoluteUrl("/terms"),
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: absoluteUrl("/license"),
    },
  ];
}
