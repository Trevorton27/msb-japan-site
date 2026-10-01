import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";

type LineageLanding = {
  intro: { kind: "quote" | "heading"; text: string };
  paragraphs: string[];
};

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 3).
// D3: the JA quote has no EN translation; the EN line is a title, so it renders as a heading.
const content = {
  ja: {
    intro: {
      kind: "quote",
      text: "「精神の道とは、精神修行と日常生活を融合させることにある」",
    },
    paragraphs: [
      "リンポチェは自らの人生においても、仏教を説き、法脈・家族・弟子に誠実に関わり、ときにはアーティストとして抽象画の製作に情熱を注ぎながら、その一方で自立心を保ち、リトリート（隠遁修行）に喜びを見出して自ら道を歩むという揺るぎない決意を堅持することに努めています。これらを取り残すことなく実践し、修行と日常生活を融合させています。修行と日常を融合するとは、心の本性を離れることなく、人生の喜びや困難など、あらゆる体験に、柔軟かつ勇敢に、そして探求心を持って取り組むことを意味します。",
    ],
  },
  en: {
    intro: {
      kind: "heading",
      text: "“A Spiritual Life in Modern Times”",
    },
    paragraphs: [
      "Kongtrul Rinpoche's life defines what it means to be a spiritual person in modern times. Whether through his teaching, his passion as an abstract painter, his steadfast dedication to his lineage and students, or in his joy in solitude, he shows what it means to have an unshakable determination to engage in the spiritual path. Weaving his ancient spiritual heritage with the many threads of our modern culture, Rinpoche is known for his uncompromising integrity, deep conviction in altruism, and insistence that all beings, whatever their background, can awaken to their own enlightened nature.",
    ],
  },
} satisfies Record<Locale, LineageLanding>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: `${dict.common.lineage} — MSB Japan`,
    description: content[locale].paragraphs[0],
  };
}

export default async function LineagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const c = (await getDictionary(locale)).common;
  const t = content[locale];

  const pages = [
    { label: c.teachers, href: `/${locale}/teachers` },
    { label: c.whatIsBuddhism, href: `/${locale}/lineage/buddhism` },
    { label: c.tibetanBuddhism, href: `/${locale}/lineage/tibetan-buddhism` },
    { label: c.nyingma, href: `/${locale}/lineage/nyingma` },
    { label: c.longchenNyingtik, href: `/${locale}/lineage/longchen-nyingtik` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">{c.lineage}</h1>
      {t.intro.kind === "quote" ? (
        <blockquote className="border-burgundy-500 text-charcoal-700 mt-8 border-l-4 pl-6 text-xl leading-relaxed italic">
          {t.intro.text}
        </blockquote>
      ) : (
        <h2 className="text-charcoal-800 mt-8 text-2xl font-semibold">
          {t.intro.text}
        </h2>
      )}
      {t.paragraphs.map((p) => (
        <p key={p} className="text-charcoal-600 mt-6 leading-relaxed">
          {p}
        </p>
      ))}
      <ul className="border-charcoal-200 mt-10 space-y-3 border-t pt-8">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="text-burgundy-600 hover:text-burgundy-700 text-lg transition-colors"
            >
              {p.label} ›
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
