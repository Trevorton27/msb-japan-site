import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.common.lineage} — MSB Japan` };
}

export default async function LineagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const c = (await getDictionary(locale)).common;

  const pages = [
    { label: c.teachers, href: `/${locale}/teachers` },
    { label: c.whatIsBuddhism, href: `/${locale}/lineage/buddhism` },
    { label: c.tibetanBuddhism, href: `/${locale}/lineage/tibetan-buddhism` },
    { label: c.nyingma, href: `/${locale}/lineage/nyingma` },
    { label: c.longchenNyingtik, href: `/${locale}/lineage/longchen-nyingtik` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">{c.lineage}</h1>
      <ul className="mt-8 space-y-3">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="text-lg text-burgundy-600 transition-colors hover:text-burgundy-700"
            >
              {p.label} ›
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
