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
          designation: dict.donate?.designation ?? "お志の指定",
          designationGeneral: dict.donate?.designationGeneral ?? "一般寄付",
          designationLifeRelease:
            dict.donate?.designationLifeRelease ?? "放生会（1口2,000円から）",
          designationDrupcho:
            dict.donate?.designationDrupcho ??
            "ドゥプチュ供養（1口2,000円から）",
          prayerRequest: dict.donate?.prayerRequest ?? "祈願文",
          prayerRequestHint:
            dict.donate?.prayerRequestHint ??
            "具体的な内容と共にご自分のお名前を添えてください。",
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
          designation: dict.donate?.designation ?? "Designation",
          designationGeneral: dict.donate?.designationGeneral ?? "General fund",
          designationLifeRelease:
            dict.donate?.designationLifeRelease ??
            "Life-release ceremony (from ¥2,000 per unit)",
          designationDrupcho:
            dict.donate?.designationDrupcho ??
            "Drupchö sponsorship (from ¥2,000 per unit)",
          prayerRequest: dict.donate?.prayerRequest ?? "Prayer request",
          prayerRequestHint:
            dict.donate?.prayerRequestHint ??
            "Please include specific wishes and your name.",
        };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-charcoal-900 text-3xl font-bold">
          {dict.home?.donateCta}
        </h1>
        <p className="text-charcoal-600 mt-4">{dict.home?.donateDesc}</p>
      </div>

      <DonationForm locale={locale} dict={donateDict} />
    </div>
  );
}
