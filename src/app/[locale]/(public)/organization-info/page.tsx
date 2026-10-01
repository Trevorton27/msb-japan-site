import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type OrganizationContent = {
  title: string;
  heading: string;
  paragraphs: string[];
  historyLink: string;
};

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 2, 法人概要).
const content = {
  ja: {
    title: "法人概要",
    heading: "一般社団法人マンガラ・シュリ・ブティ・ジャパンとは",
    paragraphs: [
      "マンガラ・シュリ・ブティ・ジャパン（MSBJ）は、ズィガー・コントゥル・リンポチェの指導の下、ニンマ派ロンチェン・ニンティクの法脈を学ぶサンガ（僧伽：仏の道を共に学ぶ集合体）です。",
      "リンポチェが初来日された2001年4月に、米国 Mangala Shri Bhutiの日本支部（任意団体）として設立されました。その後、毎年リンポチェをお迎えし、伝統的な仏典を題材にしながら、継続して法話会を開催しています。",
      "また法話を聞いて終わるのではなく、日常生活でその教えを実践し、個人の体験に基づいて理解を深められるよう毎月、勉強会と座禅会を開催しています。",
      "2015年11月2日、サンガの公益性をより高め、その活動を将来に継承していくために一般社団法人化しました。",
    ],
    historyLink: "法人概要・沿革はこちら",
  },
  en: {
    title: "Organization Overview",
    heading:
      "About Mangala Shri Bhuti Japan (General Incorporated Association)",
    paragraphs: [
      "Mangala Shri Bhuti Japan (MSBJ) is a sangha community that studies and practices the Buddhist path together under the guidance of Dzigar Kongtrul Rinpoche in accordance with the Longchen Nyingtik lineage of the Nyingma school of Tibetan Buddhism.",
      "MSBJ was established in April 2001, when Rinpoche first visited Japan, as an unincorporated Japan chapter of Mangala Shri Bhuti in the U.S. Since then, we have continued to hold annual teaching gatherings with Rinpoche and other lineage teachers, drawing on traditional Buddhist texts.",
      "Beyond reading and listening to the teachings, we hold monthly study groups and meditation retreats so that members can put the teachings into practice in daily life and deepen their understanding through personal experience.",
      "On November 2, 2015, MSBJ became a General Incorporated Association in order to further our ability to benefit the sangha and to ensure that its activities are carried forward into the future.",
    ],
    historyLink: "Organization details and history: see here",
  },
} satisfies Record<Locale, OrganizationContent>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = content[locale];
  return {
    title: `${t.title} — MSB Japan`,
    description: t.paragraphs[0],
  };
}

export default async function OrganizationInfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = content[locale];
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">{t.title}</h1>
      <h2 className="text-charcoal-900 mt-8 text-xl font-semibold">
        {t.heading}
      </h2>
      {t.paragraphs.map((p) => (
        <p key={p} className="text-charcoal-600 mt-4 leading-relaxed">
          {p}
        </p>
      ))}
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          href={`/${locale}/history`}
          className="text-burgundy-600 hover:text-burgundy-700 transition-colors"
        >
          {t.historyLink} ›
        </Link>
        <Link
          href={`/${locale}/bylaws`}
          className="text-burgundy-600 hover:text-burgundy-700 transition-colors"
        >
          {dict.footer.bylaws} ›
        </Link>
      </div>
    </div>
  );
}
