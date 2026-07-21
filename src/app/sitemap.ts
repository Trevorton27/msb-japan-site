import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

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

  return entries;
}
