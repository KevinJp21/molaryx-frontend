import type { MetadataRoute } from "next";
import { siteUrl } from "@/consts/site";

const publicPaths = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  {
    path: "/legal/privacy-policy",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/legal/terms-of-service",
    priority: 0.4,
    changeFrequency: "yearly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, siteUrl).href,
    lastModified,
    changeFrequency,
    priority,
  }));
}
