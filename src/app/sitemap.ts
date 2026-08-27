import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { db } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://msbjapan.org";

const staticPages = [
  "",
  "/about",
  "/centres",
  "/teachers",
  "/events",
  "/start",
  "/teachings",
  "/contact",
  "/donate",
  "/shop",
  "/privacy",
  "/tokushoho",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    }
  }

  // Dynamic: published public events
  const events = await db.event.findMany({
    where: { status: "PUBLISHED", visibility: "PUBLIC" },
    select: { slugJa: true, slugEn: true, updatedAt: true },
  });

  for (const event of events) {
    for (const locale of locales) {
      const slug = locale === "en" && event.slugEn ? event.slugEn : event.slugJa;
      entries.push({
        url: `${baseUrl}/${locale}/events/${slug}`,
        lastModified: event.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // Dynamic: published teachings
  const teachings = await db.contentPost.findMany({
    where: { status: "PUBLISHED", type: "TEACHING" },
    select: { slugJa: true, slugEn: true, updatedAt: true },
  });

  for (const teaching of teachings) {
    for (const locale of locales) {
      const slug = locale === "en" && teaching.slugEn ? teaching.slugEn : teaching.slugJa;
      entries.push({
        url: `${baseUrl}/${locale}/teachings/${slug}`,
        lastModified: teaching.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Dynamic: active books
  const books = await db.book.findMany({
    where: { active: true },
    select: { slugJa: true, slugEn: true, updatedAt: true },
  });

  for (const book of books) {
    for (const locale of locales) {
      const slug = locale === "en" && book.slugEn ? book.slugEn : book.slugJa;
      entries.push({
        url: `${baseUrl}/${locale}/books/${slug}`,
        lastModified: book.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Dynamic: active dharma centers
  const centers = await db.dharmaCenter.findMany({
    where: { active: true },
    select: { slugJa: true, slugEn: true, updatedAt: true },
  });

  for (const center of centers) {
    for (const locale of locales) {
      const slug = locale === "en" && center.slugEn ? center.slugEn : center.slugJa;
      entries.push({
        url: `${baseUrl}/${locale}/dharma-centers/${slug}`,
        lastModified: center.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
