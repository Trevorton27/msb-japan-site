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
        ? "特定商取引法に基づく表記 — MSB Japan"
        : "Specified Commercial Transactions — MSB Japan",
  };
}

export default async function TokushohoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {locale === "ja"
          ? "特定商取引法に基づく表記"
          : "Specified Commercial Transactions"}
      </h1>
      <p className="mt-4 text-charcoal-500">
        {locale === "ja"
          ? "特定商取引法に基づく表記の内容はMSBJからの提供を待って掲載されます。"
          : "Content will be published once provided by MSBJ."}
      </p>
    </div>
  );
}
