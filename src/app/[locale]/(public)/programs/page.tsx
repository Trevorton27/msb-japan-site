import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.programsTitle,
    description: dict.metadata?.programsDescription,
  };
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const t = dict.programs;

  const h2 = "text-2xl font-bold text-charcoal-900";
  const h3 = "mt-6 text-lg font-semibold text-burgundy-500";
  const para = "mt-3 leading-relaxed text-charcoal-600";
  const section = "mt-16 scroll-mt-48 border-t border-charcoal-200 pt-12";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">{t.title}</h1>
      <blockquote className="mt-8 border-l-4 border-burgundy-500 pl-6 text-lg italic leading-relaxed text-charcoal-700">
        {t.quote}
      </blockquote>
      <p className="mt-6 leading-relaxed text-charcoal-600">{t.intro}</p>

      <section id="teachings-retreats" className={section}>
        <h2 className={h2}>{t.teachingsRetreatsTitle}</h2>
        <h3 className={h3}>{t.annualTeachingTitle}</h3>
        {t.annualTeachingText.map((p) => (
          <p key={p} className={para}>
            {p}
          </p>
        ))}
      </section>

      <section id="in-person" className={section}>
        <h2 className={h2}>{t.inPersonTitle}</h2>
        <h3 className={h3}>{t.studyGroupTitle}</h3>
        <p className={para}>{t.studyGroupText}</p>
        <h3 className={h3}>{t.retreatTitle}</h3>
        <p className={para}>{t.retreatText}</p>
      </section>

      <section id="online-lineage-course" className={section}>
        <h2 className={h2}>{t.onlineCourseTitle}</h2>
        {t.onlineCourseText.map((p) => (
          <p key={p} className={para}>
            {p}
          </p>
        ))}
      </section>

      <section id="tsok" className={section}>
        <h2 className={h2}>{t.tsokTitle}</h2>
        <p className={para}>{t.tsokText}</p>
      </section>

      <section id="compassionate-activity" className={section}>
        <h2 className={h2}>{t.compassionateTitle}</h2>
        <h3 className={h3}>{t.lifeReleaseTitle}</h3>
        <p className={para}>{t.lifeReleaseText}</p>
        <p className="mt-3 font-medium text-charcoal-800">{t.lifeReleaseDonation}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={`/${locale}/life-release`}
            className="text-sm font-semibold text-burgundy-600 transition-colors hover:text-burgundy-700"
          >
            {dict.common.learnMore} ›
          </Link>
          <Link
            href={`/${locale}/events`}
            className="text-sm font-semibold text-burgundy-600 transition-colors hover:text-burgundy-700"
          >
            {dict.common.calendar} ›
          </Link>
        </div>
      </section>
    </div>
  );
}
