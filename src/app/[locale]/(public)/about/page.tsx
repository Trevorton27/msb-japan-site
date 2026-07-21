import type { Metadata } from "next";
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
    title: dict.metadata?.aboutTitle,
    description: dict.metadata?.aboutDescription,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const values = [
    { title: dict.about?.studyTitle, text: dict.about?.studyText },
    { title: dict.about?.practiceTitle, text: dict.about?.practiceText },
    { title: dict.about?.communityTitle, text: dict.about?.communityText },
    { title: dict.about?.serviceTitle, text: dict.about?.serviceText },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.about?.title}
      </h1>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.about?.missionTitle}
        </h2>
        <p className="mt-4 text-charcoal-600 leading-relaxed">
          {dict.about?.missionText}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.about?.historyTitle}
        </h2>
        <p className="mt-4 text-charcoal-600 leading-relaxed">
          {dict.about?.historyText}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.about?.valuesTitle}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <Card key={v.title}>
              <CardHeader>
                <CardTitle className="text-burgundy-500">{v.title}</CardTitle>
                <CardDescription>{v.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
