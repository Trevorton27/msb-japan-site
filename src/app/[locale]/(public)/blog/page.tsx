import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublishedPosts } from "@/server/queries/content";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.common?.blog} — MSB Japan` };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const posts = await getPublishedPosts({ type: "BLOG" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.common?.blog}
      </h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-charcoal-500">
          {locale === "ja"
            ? "まだブログ記事はありません。"
            : "No blog posts yet."}
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => {
            const slug =
              locale === "en" && post.slugEn ? post.slugEn : post.slugJa;
            const title =
              locale === "en" && post.titleEn ? post.titleEn : post.titleJa;
            const excerpt =
              locale === "en" && post.excerptEn
                ? post.excerptEn
                : post.excerptJa;

            return (
              <Link key={post.id} href={`/${locale}/blog/${slug}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {post.teacher && (
                      <p className="text-sm text-charcoal-500">
                        {locale === "en" && post.teacher.nameEn
                          ? post.teacher.nameEn
                          : post.teacher.nameJa}
                      </p>
                    )}
                    {excerpt && (
                      <CardDescription className="mt-1 line-clamp-2">
                        {excerpt}
                      </CardDescription>
                    )}
                    {post.publishedAt && (
                      <p className="mt-1 text-xs text-charcoal-500">
                        {post.publishedAt.toLocaleDateString(
                          locale === "ja" ? "ja-JP" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
