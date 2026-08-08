import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getCenterBySlug } from "@/server/queries/centers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const center = await getCenterBySlug(slug, locale as Locale);
  if (!center) return {};
  const name = locale === "en" && center.nameEn ? center.nameEn : center.nameJa;
  return { title: name };
}

export default async function DharmaCenterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const [center, dict] = await Promise.all([
    getCenterBySlug(slug, locale as Locale),
    getDictionary(locale as Locale),
  ]);

  if (!center) notFound();

  const name = locale === "en" && center.nameEn ? center.nameEn : center.nameJa;
  const location =
    locale === "en" && center.locationEn ? center.locationEn : center.locationJa;
  const description =
    locale === "en" && center.descriptionEn
      ? center.descriptionEn
      : center.descriptionJa;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/centres`}
        className="text-sm text-charcoal-500 hover:text-charcoal-900"
      >
        ← {locale === "ja" ? "センター一覧" : "All Centers"}
      </Link>

      <div className="mt-8">
        {center.imageUrl && (
          <img
            src={center.imageUrl}
            alt={name}
            className="mb-8 h-64 w-full rounded-sm object-cover shadow-md"
          />
        )}
        <h1 className="text-3xl font-bold text-[#1e3560]">{name}</h1>
        {(location || center.country) && (
          <p className="mt-2 text-base text-charcoal-500">
            {[location, center.country].filter(Boolean).join(", ")}
          </p>
        )}
        {description && (
          <div className="mt-6 space-y-3 text-base leading-relaxed text-charcoal-600">
            {description.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
        {center.websiteUrl && (
          <a
            href={center.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-sm bg-saffron-500 px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
          >
            {locale === "ja" ? "ウェブサイトを見る" : "Visit Website"}
          </a>
        )}
      </div>
    </div>
  );
}
