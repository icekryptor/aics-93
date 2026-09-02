import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllServices } from "@/lib/services";
import { getAllServices as getAllEnServices } from "@/lib/en/services";
import { getAllSolutions } from "@/lib/solutions";
import { getAllCases } from "@/lib/cases";

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
    // English section (/en) — key pages only, hreflang lives in page metadata
    { url: `${SITE_URL}/en`, lastModified: new Date("2026-09-02"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/en/services`, lastModified: new Date("2026-09-02"), changeFrequency: "monthly", priority: 0.6 },
    ...getAllEnServices().map((s) => ({
      url: `${SITE_URL}/en/services/${s.slug}`,
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/en/operator`, lastModified: new Date("2026-09-02"), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/blog`, lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/classic`, lastModified: new Date("2026-07-02"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/ai`, lastModified: new Date("2026-07-18"), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/operator`, lastModified: new Date("2026-07-25"), changeFrequency: "monthly", priority: 0.4 },
    ...getAllCases().map((c) => ({
      url: `${SITE_URL}/cases/${c.slug}`,
      lastModified: new Date("2026-07-20"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
