import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
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
        ? "ご寄付ありがとうございます — MSB Japan"
        : "Thank You — MSB Japan",
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-charcoal-900">
        {locale === "ja"
          ? "ご寄付ありがとうございます"
          : "Thank You for Your Donation"}
      </h1>

      <p className="mt-4 text-charcoal-600">
        {locale === "ja"
          ? "温かいご支援に心より感謝いたします。確認メールをお送りしました。"
          : "Your generous support means a lot to us. A confirmation email has been sent."}
      </p>

      <div className="mt-8">
        <Link
          href={`/${locale}`}
          className="text-burgundy-600 hover:text-burgundy-700 font-medium"
        >
          {dict.common?.backToHome}
        </Link>
      </div>
    </div>
  );
}
