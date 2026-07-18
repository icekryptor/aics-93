import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllServices } from "@/lib/services";
import { getAllSolutions } from "@/lib/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const services = getAllServices();
  const solutions = getAllSolutions();
  const newest = posts[0]?.date ? new Date(posts[0].date) : new Date("2026-07-06");

  return [
    { url: SITE_URL, lastModified: newest, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: new Date("2026-07-06"), changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: new Date("2026-07-06"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/solutions`, lastModified: new Date("2026-07-18"), changeFrequency: "monthly", priority: 0.9 },
    ...solutions.map((s) => ({
      url: `${SITE_URL}/solutions/${s.slug}`,
      lastModified: new Date("2026-07-15"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/blog`, lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/classic`, lastModified: new Date("2026-07-02"), changeFrequency: "yearly", priority: 0.3 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
