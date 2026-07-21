import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { DonationForm } from "@/components/public/donation-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: `${dict.common?.donate} — MSB Japan`,
    description:
      locale === "ja"
        ? "マンガラ・シュリー・ブーティ・ジャパンへのご寄付"
        : "Support Mangala Shri Bhuti Japan with a donation",
  };
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const donateDict =
    locale === "ja"
      ? {
          amount: "金額",
          customAmount: "その他の金額",
          oneTime: "一回のみ",
          monthly: "毎月",
          name: "お名前",
          nameOptional: "任意",
          email: "メールアドレス",
          message: "メッセージ",
          messageOptional: "任意",
          donate: "寄付する",
          processing: "処理中...",
          error: "エラーが発生しました。もう一度お試しください。",
        }
      : {
          amount: "Amount",
          customAmount: "Custom Amount",
          oneTime: "One-time",
          monthly: "Monthly",
          name: "Name",
          nameOptional: "optional",
          email: "Email",
          message: "Message",
          messageOptional: "optional",
          donate: "Donate",
          processing: "Processing...",
          error: "An error occurred. Please try again.",
        };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-charcoal-900">
          {dict.home?.donateCta}
        </h1>
        <p className="mt-4 text-charcoal-600">{dict.home?.donateDesc}</p>
      </div>

      <DonationForm locale={locale} dict={donateDict} />
    </div>
  );
}
