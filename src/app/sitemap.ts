import type { MetadataRoute } from "next";
import { appUrl } from "@/env";
import { prisma } from "@/lib/prisma";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/method", priority: 0.9, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.9, changeFrequency: "weekly" },
  { path: "/academy", priority: 0.8, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.8, changeFrequency: "weekly" },
  { path: "/library", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/podcast", priority: 0.7, changeFrequency: "weekly" },
  { path: "/lab", priority: 0.9, changeFrequency: "monthly" },
  { path: "/lab/audit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/community", priority: 0.6, changeFrequency: "monthly" },
  { path: "/stories", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/accessibility", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${appUrl}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Published Library content — resilient if the DB is unavailable at build time.
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    for (const a of articles) {
      entries.push({
        url: `${appUrl}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    for (const c of courses) {
      entries.push({
        url: `${appUrl}/courses/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Static routes still ship.
  }

  return entries;
}
