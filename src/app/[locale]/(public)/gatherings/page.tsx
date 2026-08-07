import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.gatheringsTitle,
    description: dict.metadata?.gatheringsDescription,
  };
}

export default async function GatheringsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const sections = [
    {
      title: dict.gatherings?.meditationTitle,
      description: dict.gatherings?.meditationDesc,
    },
    {
      title: dict.gatherings?.studyTitle,
      description: dict.gatherings?.studyDesc,
    },
    {
      title: dict.gatherings?.communityTitle,
      description: dict.gatherings?.communityDesc,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.gatherings?.title}
      </h1>
      <p className="mt-4 text-charcoal-600 leading-relaxed">
        {dict.gatherings?.description}
      </p>

      <h2 className="mt-12 text-2xl font-semibold text-charcoal-900">
        {dict.gatherings?.whatToExpect}
      </h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-burgundy-500">
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-charcoal-200 bg-ivory-50 p-6 text-center">
        <p className="text-charcoal-600">
          {dict.gatherings?.noGatherings}
        </p>
        <Link
          href={`/${locale}/events`}
          className="mt-4 inline-block rounded-md bg-burgundy-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
        >
          {dict.common?.events}
        </Link>
      </div>
    </div>
  );
}
