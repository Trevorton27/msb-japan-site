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
    title: dict.metadata?.memberProgramsTitle,
    description: dict.metadata?.memberProgramsDescription,
  };
}

export default async function MemberProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const sections = [
    {
      title: dict.memberPrograms?.studyTitle,
      description: dict.memberPrograms?.studyDesc,
    },
    {
      title: dict.memberPrograms?.practiceTitle,
      description: dict.memberPrograms?.practiceDesc,
    },
    {
      title: dict.memberPrograms?.mentorTitle,
      description: dict.memberPrograms?.mentorDesc,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.memberPrograms?.title}
      </h1>
      <p className="mt-4 text-charcoal-600 leading-relaxed">
        {dict.memberPrograms?.description}
      </p>

      <div className="mt-12 rounded-lg border border-charcoal-200 bg-ivory-50 p-6">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.memberPrograms?.aboutTitle}
        </h2>
        <p className="mt-2 text-charcoal-600 leading-relaxed">
          {dict.memberPrograms?.aboutDesc}
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
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
          {dict.memberPrograms?.noPrograms}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-4 inline-block rounded-md bg-burgundy-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
        >
          {dict.common?.contact}
        </Link>
      </div>
    </div>
  );
}
