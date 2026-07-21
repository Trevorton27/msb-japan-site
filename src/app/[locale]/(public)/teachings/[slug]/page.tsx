import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const post = await getPostBySlug(slug, locale as "ja" | "en");
  if (!post) return {};
  const title = locale === "en" && post.titleEn ? post.titleEn : post.titleJa;
  return { title: `${title} — MSB Japan` };
}

export default async function TeachingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const post = await getPostBySlug(slug, locale as "ja" | "en");
  if (!post) notFound();

  const dict = await getDictionary(locale as Locale);

  const title = locale === "en" && post.titleEn ? post.titleEn : post.titleJa;
  const body = locale === "en" && post.bodyEn ? post.bodyEn : post.bodyJa;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/teachings`}
        className="text-sm text-charcoal-500 hover:text-charcoal-900"
      >
        &larr; {dict.common?.teachings}
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-charcoal-900">{title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-charcoal-500">
        <Badge variant="secondary">{post.type}</Badge>
        {post.teacher && (
          <span>
            {locale === "en" && post.teacher.nameEn
              ? post.teacher.nameEn
              : post.teacher.nameJa}
          </span>
        )}
        {post.publishedAt && (
          <span>
            {post.publishedAt.toLocaleDateString(
              locale === "ja" ? "ja-JP" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </span>
        )}
      </div>

      {post.mediaUrl && (
        <div className="mt-6">
          {post.type === "VIDEO" ? (
            <video controls className="w-full rounded-lg" src={post.mediaUrl} />
          ) : post.type === "AUDIO" ? (
            <audio controls className="w-full" src={post.mediaUrl} />
          ) : null}
        </div>
      )}

      {body && (
        <div className="prose mt-8 max-w-none whitespace-pre-wrap text-charcoal-600 leading-relaxed">
          {body}
        </div>
      )}
    </div>
  );
}
