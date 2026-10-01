import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  LineageArticle,
  type LineageBlock,
} from "@/components/public/lineage-article";

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 3-4).
// EN is a new MSBJ translation pending native review (D2).
const content = {
  ja: {
    blocks: [
      {
        kind: "paragraph",
        text: "ニンマ派は、パドマサンバヴァ（グル・リンポチェ）を宗祖とし、タントラと埋蔵教典（テルマ）に依拠する宗派で、「ゾクチェン」（ゾクパ・チェンポ、大いなる完成）を最奥義とします。ニンマ派の中にも、カンドゥ・ニンティクやビィマ・ニンティク、ロンチェン・ニンティクなどいくつかの系譜が存在します。",
      },
    ],
  },
  en: {
    blocks: [
      {
        kind: "paragraph",
        text: "The Nyingma school traces its founder to Padmasambhava (Guru Rinpoche) and relies on the tantras and the terma (revealed treasure) teachings, with Dzogchen (“the Great Perfection”) as its ultimate teaching. Within the Nyingma school there are several lineages, including Khandro Nyingtik, Vima Nyingtik, and Longchen Nyingtik.",
      },
    ],
  },
} satisfies Record<Locale, { blocks: LineageBlock[] }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const first = content[locale].blocks[0];
  return {
    title: `${dict.common.nyingma} — MSB Japan`,
    description: first?.kind === "paragraph" ? first.text : undefined,
  };
}

export default async function NyingmaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LineageArticle
      title={dict.common.nyingma}
      blocks={content[locale].blocks}
      backHref={`/${locale}/lineage`}
      backLabel={dict.common.lineage}
    />
  );
}
