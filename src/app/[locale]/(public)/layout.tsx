import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { AnalyticsTracker } from "@/components/public/analytics-tracker";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <SiteHeader locale={locale as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale as Locale} dict={dict} />
      <AnalyticsTracker />
    </>
  );
}
