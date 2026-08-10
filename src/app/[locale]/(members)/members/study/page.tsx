import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getPublishedMemberResources } from "@/server/queries/member-resources";
import { t } from "@/lib/admin-locale";
import type { ResourceType } from "@prisma/client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const RESOURCE_TYPE_KEYS: Record<ResourceType, keyof ReturnType<typeof buildTypeLabels>> = {
  ARTICLE: "article",
  PDF: "pdf",
  AUDIO: "audio",
  VIDEO: "video",
  LINK: "link",
  PRACTICE_TEXT: "practiceText",
  COURSE_MATERIAL: "courseMaterial",
  RETREAT_MATERIAL: "retreatMaterial",
};

function buildTypeLabels(study: {
  article: string; pdf: string; audio: string; video: string; link: string;
  practiceText: string; courseMaterial: string; retreatMaterial: string;
}) {
  return study;
}

export default async function MemberStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const { type } = await searchParams;
  const dict = await getDictionary(locale as Locale);
  const s = dict.members.study;

  const resourceType = type as ResourceType | undefined;
  const resources = await getPublishedMemberResources(
    resourceType ? { resourceType } : undefined
  );

  const typeLabels: Record<ResourceType, string> = {
    ARTICLE: s.article,
    PDF: s.pdf,
    AUDIO: s.audio,
    VIDEO: s.video,
    LINK: s.link,
    PRACTICE_TEXT: s.practiceText,
    COURSE_MATERIAL: s.courseMaterial,
    RETREAT_MATERIAL: s.retreatMaterial,
  };

  const allTypes: ResourceType[] = [
    "ARTICLE", "PDF", "AUDIO", "VIDEO", "LINK",
    "PRACTICE_TEXT", "COURSE_MATERIAL", "RETREAT_MATERIAL",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-semibold text-charcoal-900">{s.title}</h1>
      <p className="mb-6 text-sm text-charcoal-500">{s.description}</p>

      {/* Type filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/${locale}/members/study`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !type
              ? "bg-burgundy-500 text-white"
              : "border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-200/30"
          }`}
        >
          {s.allTypes}
        </Link>
        {allTypes.map((rt) => (
          <Link
            key={rt}
            href={`/${locale}/members/study?type=${rt}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              type === rt
                ? "bg-burgundy-500 text-white"
                : "border border-charcoal-200 text-charcoal-600 hover:bg-charcoal-200/30"
            }`}
          >
            {typeLabels[rt]}
          </Link>
        ))}
      </div>

      {/* Resource list */}
      {resources.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const slug = locale === "en" ? (r.slugEn ?? r.slugJa) : r.slugJa;
            return (
              <li key={r.id}>
                <Link
                  href={`/${locale}/members/study/${slug}`}
                  className="block h-full rounded-lg border border-charcoal-200 bg-white p-4 transition-colors hover:border-burgundy-500/40 hover:bg-ivory-100"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-charcoal-400">
                      {typeLabels[r.resourceType]}
                    </span>
                    {r.featured && (
                      <span className="rounded-full bg-saffron-500/10 px-2 py-0.5 text-xs font-medium text-saffron-600">
                        ★
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-charcoal-900 line-clamp-2">
                    {t(locale as Locale, r.titleJa, r.titleEn)}
                  </p>
                  {(r.descriptionJa || r.descriptionEn) && (
                    <p className="mt-2 text-sm text-charcoal-500 line-clamp-3">
                      {t(locale as Locale, r.descriptionJa, r.descriptionEn)}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-lg border border-charcoal-200 bg-white p-12 text-center">
          <p className="text-charcoal-400">{s.noResources}</p>
        </div>
      )}
    </div>
  );
}
