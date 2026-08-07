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
    title: dict.metadata?.lifeReleaseTitle,
    description: dict.metadata?.lifeReleaseDescription,
  };
}

export default async function LifeReleasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.lifeRelease?.title}
      </h1>
      <p className="mt-4 text-charcoal-600 leading-relaxed">
        {dict.lifeRelease?.description}
      </p>

      <div className="mt-12 rounded-lg border border-charcoal-200 bg-ivory-50 p-6">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.lifeRelease?.whatIsTitle}
        </h2>
        <p className="mt-2 text-charcoal-600 leading-relaxed">
          {dict.lifeRelease?.whatIsDesc}
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-charcoal-200 bg-ivory-50 p-6">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.lifeRelease?.howToParticipate}
        </h2>
        <p className="mt-2 text-charcoal-600 leading-relaxed">
          {dict.lifeRelease?.participateDesc}
        </p>
        <Link
          href={`/${locale}/donate`}
          className="mt-4 inline-block rounded-md bg-burgundy-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
        >
          {dict.common?.donate}
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.lifeRelease?.upcomingTitle}
        </h2>
        <div className="mt-4 rounded-lg border border-charcoal-200 bg-ivory-50 p-6 text-center">
          <p className="text-charcoal-600">
            {dict.lifeRelease?.noCeremonies}
          </p>
        </div>
      </div>
    </div>
  );
}
