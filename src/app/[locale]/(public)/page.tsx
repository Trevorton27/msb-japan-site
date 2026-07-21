import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { NewsletterForm } from "@/components/public/newsletter-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.title,
    description: dict.metadata?.description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-900 px-4 py-24 text-center text-white sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {dict.home?.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal-200">
            {dict.home?.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/start`}
              className="rounded-md bg-saffron-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-saffron-600"
            >
              {dict.home?.heroCta}
            </Link>
            <Link
              href={`/${locale}/events`}
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {dict.common?.events}
            </Link>
          </div>
        </div>
      </section>

      {/* Visitor Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href={`/${locale}/start`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-burgundy-500">
                  {dict.home?.forVisitors}
                </CardTitle>
                <CardDescription>
                  {dict.home?.forVisitorsDesc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href={`/${locale}/events`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-burgundy-500">
                  {dict.home?.upcomingEvents}
                </CardTitle>
                <CardDescription>
                  {dict.home?.upcomingEventsDesc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href={`/${locale}/teachings`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-burgundy-500">
                  {dict.home?.teachingsLibrary}
                </CardTitle>
                <CardDescription>
                  {dict.home?.teachingsLibraryDesc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Centres */}
      <section className="bg-ivory-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {dict.home?.ourCentres}
          </h2>
          <p className="mt-2 text-charcoal-600">{dict.home?.ourCentresDesc}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Link href={`/${locale}/centres#tashi-gachil`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{dict.centres?.tashiGachil}</CardTitle>
                  <CardDescription>
                    {dict.centres?.tashiGachilDesc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href={`/${locale}/centres#tashi-choling`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{dict.centres?.tashiCholing}</CardTitle>
                  <CardDescription>
                    {dict.centres?.tashiCholingDesc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {dict.home?.donateCta}
          </h2>
          <p className="mt-4 text-charcoal-600">{dict.home?.donateDesc}</p>
          <Link
            href={`/${locale}/donate`}
            className="mt-6 inline-block rounded-md bg-burgundy-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-burgundy-600"
          >
            {dict.home?.donateButton}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-ivory-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {dict.home?.newsletterTitle}
          </h2>
          <p className="mt-2 text-charcoal-600">{dict.home?.newsletterDesc}</p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm
              placeholder={dict.home?.newsletterPlaceholder ?? ""}
              buttonText={dict.home?.newsletterButton ?? ""}
              successText={dict.home?.newsletterSuccess ?? ""}
            />
          </div>
        </div>
      </section>
    </>
  );
}
