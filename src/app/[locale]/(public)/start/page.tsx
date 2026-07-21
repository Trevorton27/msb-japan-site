import Link from "next/link";
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
    title: dict.metadata?.startTitle,
    description: dict.metadata?.startDescription,
  };
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const offerings = [
    {
      title: dict.start?.meditationTitle,
      desc: dict.start?.meditationDesc,
    },
    {
      title: dict.start?.studyGroupTitle,
      desc: dict.start?.studyGroupDesc,
    },
    {
      title: dict.start?.retreatTitle,
      desc: dict.start?.retreatDesc,
    },
  ];

  const steps = [
    { title: dict.start?.step1Title, desc: dict.start?.step1Desc },
    { title: dict.start?.step2Title, desc: dict.start?.step2Desc },
    { title: dict.start?.step3Title, desc: dict.start?.step3Desc },
  ];

  const faqs = [
    { q: dict.start?.faq1Q, a: dict.start?.faq1A },
    { q: dict.start?.faq2Q, a: dict.start?.faq2A },
    { q: dict.start?.faq3Q, a: dict.start?.faq3A },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Intro */}
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.start?.title}
      </h1>
      <p className="mt-2 text-xl text-charcoal-600">{dict.start?.subtitle}</p>
      <p className="mt-6 text-charcoal-600 leading-relaxed">
        {dict.start?.intro}
      </p>

      {/* What We Offer */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-charcoal-900">
          {dict.start?.whatWeOffer}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {offerings.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg text-burgundy-500">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How to Start */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-charcoal-900">
          {dict.start?.howToStart}
        </h2>
        <div className="mt-6 space-y-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-sm font-bold text-white">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-charcoal-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-4">
          <Link
            href={`/${locale}/events`}
            className="rounded-md bg-burgundy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-burgundy-600"
          >
            {dict.common?.events}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="rounded-md border border-charcoal-200 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-ivory-100"
          >
            {dict.common?.contact}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-charcoal-900">
          {dict.start?.faq}
        </h2>
        <div className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold text-charcoal-900">{faq.q}</h3>
              <p className="mt-2 text-charcoal-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
