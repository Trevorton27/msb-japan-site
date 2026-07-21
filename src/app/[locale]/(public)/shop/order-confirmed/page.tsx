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
        ? "ご注文確認 — MSB Japan"
        : "Order Confirmed — MSB Japan",
  };
}

export default async function OrderConfirmedPage({
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
        {locale === "ja" ? "ご注文ありがとうございます" : "Order Confirmed"}
      </h1>

      <p className="mt-4 text-charcoal-600">
        {locale === "ja"
          ? "ご注文を承りました。確認メールをお送りしました。"
          : "Your order has been placed. A confirmation email has been sent."}
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href={`/${locale}/shop`}
          className="text-burgundy-600 hover:text-burgundy-700 font-medium"
        >
          {locale === "ja" ? "ショップに戻る" : "Continue Shopping"}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-charcoal-500 hover:text-charcoal-700"
        >
          {dict.common?.backToHome}
        </Link>
      </div>
    </div>
  );
}
