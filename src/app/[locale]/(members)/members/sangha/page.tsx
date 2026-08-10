import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getPublishedAnnouncements } from "@/server/queries/member-announcements";
import { t } from "@/lib/admin-locale";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MemberSanghaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const s = dict.members.sangha;

  const announcements = await getPublishedAnnouncements();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-semibold text-charcoal-900">{s.title}</h1>
      <p className="mb-8 text-sm text-charcoal-500">{s.description}</p>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
          {s.announcements}
        </h2>
        {announcements.length > 0 ? (
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li
                key={a.id}
                className={`rounded-lg border bg-white p-5 ${
                  a.pinned ? "border-saffron-500/40" : "border-charcoal-200"
                }`}
              >
                {a.pinned && (
                  <span className="mb-2 inline-block text-xs font-semibold text-saffron-600">
                    📌 {s.pinned}
                  </span>
                )}
                <h3 className="font-semibold text-charcoal-900">
                  {t(locale as Locale, a.titleJa, a.titleEn)}
                </h3>
                <p className="mt-1 text-xs text-charcoal-400">
                  {formatDate(a.publishedAt ?? a.createdAt, locale)}
                </p>
                <div className="mt-3 text-sm leading-relaxed text-charcoal-700 whitespace-pre-wrap">
                  {t(locale as Locale, a.contentJa, a.contentEn)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-charcoal-200 bg-white p-12 text-center">
            <p className="text-charcoal-400">{s.noAnnouncements}</p>
          </div>
        )}
      </section>
    </div>
  );
}
