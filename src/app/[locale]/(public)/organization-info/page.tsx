import type { Metadata } from "next";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title:
      locale === "ja"
        ? "団体概要 — MSB Japan"
        : "Organization Info — MSB Japan",
  };
}

export default async function OrganizationInfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {locale === "ja" ? "団体概要" : "Organization Info"}
      </h1>
      <p className="mt-4 text-charcoal-500">
        {locale === "ja"
          ? "団体概要の内容は準備中です。"
          : "Organization information will be published soon."}
      </p>
    </div>
  );
}
