import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MemberUnauthorizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const t = dict.members.unauthorized;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-4 py-16">
      <div className="max-w-md text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-burgundy-500">
          {dict.members.nav.portal}
        </p>
        <h1 className="mb-4 text-2xl font-semibold text-charcoal-900">{t.title}</h1>
        <p className="mb-8 text-sm leading-relaxed text-charcoal-600">{t.message}</p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block rounded-md bg-burgundy-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
        >
          {t.contact}
        </Link>
      </div>
    </div>
  );
}
