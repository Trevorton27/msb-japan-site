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
        ? "プライバシーポリシー — MSB Japan"
        : "Privacy Policy — MSB Japan",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {locale === "ja" ? "プライバシーポリシー" : "Privacy Policy"}
      </h1>
      <p className="mt-4 text-charcoal-500">
        {locale === "ja"
          ? "プライバシーポリシーの内容はMSBJからの提供を待って掲載されます。"
          : "Privacy policy content will be published once provided by MSBJ."}
      </p>
    </div>
  );
}
