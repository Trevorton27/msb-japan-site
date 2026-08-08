import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getBookBySlug } from "@/server/queries/books";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const book = await getBookBySlug(slug, locale as Locale);
  if (!book) return {};
  const title = locale === "en" && book.titleEn ? book.titleEn : book.titleJa;
  return { title };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const [book, dict] = await Promise.all([
    getBookBySlug(slug, locale as Locale),
    getDictionary(locale as Locale),
  ]);

  if (!book) notFound();

  const title = locale === "en" && book.titleEn ? book.titleEn : book.titleJa;
  const author = locale === "en" && book.authorEn ? book.authorEn : (book.authorJa ?? null);
  const description =
    locale === "en" && book.descriptionEn ? book.descriptionEn : book.descriptionJa;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/shop`}
        className="text-sm text-charcoal-500 hover:text-charcoal-900"
      >
        ← {dict.common?.booksAndPublications}
      </Link>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        {book.imageUrl && (
          <div>
            <img
              src={book.imageUrl}
              alt={title}
              className="w-full max-w-xs rounded-sm shadow-lg"
            />
          </div>
        )}
        <div className={book.imageUrl ? "" : "sm:col-span-2"}>
          <h1 className="text-3xl font-bold text-[#1e3560]">{title}</h1>
          {author && (
            <p className="mt-2 text-base font-medium text-charcoal-500">
              {author}
            </p>
          )}
          {description && (
            <div className="mt-6 space-y-3 text-base leading-relaxed text-charcoal-600">
              {description.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
          {book.purchaseUrl && (
            <a
              href={book.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-sm bg-saffron-500 px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
            >
              {locale === "ja" ? "購入する" : "Purchase"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
