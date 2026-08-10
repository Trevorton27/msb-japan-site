import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getMemberResourceBySlug } from "@/server/queries/member-resources";
import { t } from "@/lib/admin-locale";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MemberResourceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const s = dict.members.study;

  const resource = await getMemberResourceBySlug(slug, locale as Locale);
  if (!resource) notFound();

  const title = t(locale as Locale, resource.titleJa, resource.titleEn);
  const description = t(locale as Locale, resource.descriptionJa, resource.descriptionEn);
  const content = t(locale as Locale, resource.contentJa, resource.contentEn);

  const typeLabels: Record<string, string> = {
    ARTICLE: s.article, PDF: s.pdf, AUDIO: s.audio, VIDEO: s.video, LINK: s.link,
    PRACTICE_TEXT: s.practiceText, COURSE_MATERIAL: s.courseMaterial,
    RETREAT_MATERIAL: s.retreatMaterial,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/members/study`}
        className="mb-6 inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-900"
      >
        ← {s.title}
      </Link>

      <div className="rounded-lg border border-charcoal-200 bg-white p-6 sm:p-8">
        <div className="mb-2">
          <span className="text-xs font-medium text-charcoal-400">
            {typeLabels[resource.resourceType] ?? resource.resourceType}
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-charcoal-900">{title}</h1>
        {description && description !== "—" && (
          <p className="mb-6 text-sm leading-relaxed text-charcoal-600">{description}</p>
        )}

        {/* Action links */}
        <div className="mb-8 flex flex-wrap gap-3">
          {resource.fileUrl && (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-burgundy-500 px-4 py-2 text-sm font-medium text-white hover:bg-burgundy-600"
            >
              {s.download}
            </a>
          )}
          {resource.externalUrl && (
            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200/30"
            >
              {s.open}
            </a>
          )}
          {resource.audioUrl && (
            <a
              href={resource.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200/30"
            >
              ▶ {s.audio}
            </a>
          )}
          {resource.videoUrl && (
            <a
              href={resource.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200/30"
            >
              ▶ {s.video}
            </a>
          )}
        </div>

        {/* Content */}
        {content && content !== "—" && (
          <div className="post-body prose-sm max-w-none text-charcoal-800">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>
    </div>
  );
}
