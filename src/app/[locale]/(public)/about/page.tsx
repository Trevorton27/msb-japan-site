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
  const c = dict.common;
  const a = dict.about;

  const sections = [
    { title: c.vision, lead: [a.visionLead], href: `/${locale}/vision#vision` },
    { title: c.visionForJapan, lead: [a.visionForJapanLead], href: `/${locale}/vision#japan` },
    { title: c.sangha, lead: [a.sanghaLead], href: `/${locale}/vision#sangha` },
    {
      title: c.ourCenters,
      lead: [...a.centersList, a.centersReference],
      href: `/${locale}/centres`,
    },
    { title: c.supportAndDonations, lead: [a.supportText], href: `/${locale}/donate` },
    {
      title: c.organizationOverview,
      lead: [a.organizationLead],
      href: `/${locale}/organization-info`,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">{a.title}</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-burgundy-500">{section.title}</CardTitle>
                {section.lead.map((line) => (
                  <CardDescription key={line}>{line}</CardDescription>
                ))}
                <p className="mt-2 text-xs font-semibold text-burgundy-600">
                  {c.learnMore} ›
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
