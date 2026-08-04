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

  const programs = [
    {
      title: dict.programs?.meditationTitle,
      description: dict.programs?.meditationDesc,
    },
    {
      title: dict.programs?.studyGroupTitle,
      description: dict.programs?.studyGroupDesc,
    },
    {
      title: dict.programs?.retreatsTitle,
      description: dict.programs?.retreatsDesc,
    },
    {
      title: dict.programs?.onlineTitle,
      description: dict.programs?.onlineDesc,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.programs?.title}
      </h1>
      <p className="mt-4 text-charcoal-600 leading-relaxed">
        {dict.programs?.description}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {programs.map((program) => (
          <Card key={program.title}>
            <CardHeader>
              <CardTitle className="text-burgundy-500">
                {program.title}
              </CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-charcoal-200 bg-ivory-50 p-6 text-center">
        <p className="text-charcoal-600">
          {dict.programs?.noPrograms}
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
