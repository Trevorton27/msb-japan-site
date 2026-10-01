import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  LineageArticle,
  type LineageBlock,
} from "@/components/public/lineage-article";

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 3-5).
// EN is excerpted from mangalashribhuti.org and must be used as-is.
const content = {
  ja: {
    blocks: [
      {
        kind: "paragraph",
        text: "ロンチェン・ニンティクは、18世紀の埋蔵経発掘者（テルトン）、持明者ジグメ・リンパによって発見された埋蔵経（テルマ）に依拠する法脈です。サーダナ（成就法）、教説、真髄の秘訣からなるこれらの埋蔵経を、ジグメ・リンパはグル・パドマサンバヴァ、ダーキニ・イェシェ・ツォギャル、一切智者ロンチェン・ラブジャムをはじめとする数多くの導師のビジョンから直接授かりました。ジグメ・リンパは、8世紀にグル・パドマサンバヴァをチベットに招き、最初の僧院サムイェーを建立させて仏法を根付かせた法王ティソン・デツェンの化身とされています。",
      },
      {
        kind: "paragraph",
        text: "グル・リンポチェは多くの埋蔵経を王や弟子たちの心相続に埋蔵し、後にその教えを広めるのに最適な状況が整った時、彼らの化身によって発掘されるよう封印しました。ジグメ・リンパは、そうした心の埋蔵経の発掘者として、ロンチェン・ニンティクの数々のサダナ（成就法）を見出したのです。",
      },
      {
        kind: "paragraph",
        text: "この体系は、ニンティク、あるいはアティ・ヨーガの最深の教え「ゾクチェン（大いなる完成）」の名でも知られています。教えが初めて地上にもたらされたのは、ジグメ・リンパがサムイェー近郊の洞窟サムイェー・チンプで3年間のリトリートを行っていたときのことでした。14世紀のアティ・ヨーガ導師、一切智者ロンチェン・ラブジャムへの一途な献身により、彼は3度にわたってロンチェンパの智法身のビジョンに出会います。この体験を通じて、水が器から器へと注がれるように、ロンチェンパの教えとアティ・ヨーガの悟り「ゾクチェン」のすべてが、ジグメ・リンパの心に伝授されました。",
      },
      {
        kind: "paragraph",
        text: "導師（ラマ）への揺るぎない献身を勝義諦（究極の真理）を了解する最も重要な手段と位置づけるこれらの教えは、今日もなお、この体系の深遠な心髄であり続けています。ロンチェン・ニンティクは現存するニンマ派の法脈の中でも特に広く実践されている伝統のひとつで、その深さと本質的な価値ゆえに、チベット仏教四派の多くの導師や僧院で実践されています。",
      },
      {
        kind: "reference",
        text: "参考文献：『Masters of Meditation and Miracle』（Tulku Thöndup著）",
      },
    ],
  },
  en: {
    blocks: [
      {
        kind: "paragraph",
        text: "The Longchen Nyingtik Lineage is based upon the terma revelations of the 18th century treasure revealer, Rigdzin Jigme Lingpa. These revelations, composed of various sadhanas, teachings and pith instructions, were received by Jigme Lingpa through multiple visionary experiences, in which he directly encountered Guru Padmasambhava, Khandro Yeshe Tsogyal, Omniscient Longchen Rabjam and many other masters. Jigme Lingpa was a reincarnation of the 8th century Dharma King Trisong Detsen, who, in order to firmly establish the Dharma in Tibet, invited Guru Padmasambhava to Tibet to help complete and consecrate Samye, Tibet's first monastery.",
      },
      {
        kind: "paragraph",
        text: "During the king's reign, Guru Rinpoche implanted many treasure teachings directly into the king's and other main disciples' mental continuums, to be revealed by their subsequent incarnations when the time was appropriate for their practice and dissemination. Jigme Lingpa discovered many of the Longchen Nyingtik sadhanas in this manner as mind treasures.",
      },
      {
        kind: "paragraph",
        text: "The Longchen Nyingtik tradition is perhaps most well known for its cycle of nyingtik, or innermost essence teachings on Atiyoga, the Great Perfection. Jigme Lingpa received these teachings during the course of a three-year retreat he undertook at Samye Chimphu, the great retreat complex of meditation caves near Samye. Due to his single-pointed devotion to the 14th century Atiyoga master, Omniscient Longchen Rabjam (“Longchenpa”), Jigme Lingpa was able to meet Longchenpa's wisdom body in three successive visions. Through this experience, he received the entirety of Longchenpa's teachings and realization of Atiyoga, the Great Perfection, like water being poured from one vessel into another.",
      },
      {
        kind: "paragraph",
        text: "These teachings became the profound heart core of the Longchen Nyingtik lineage, which is characterized even today by its reliance on unwavering devotion to the guru as the primary means of realizing the absolute truth. The Longchen Nyingtik remains even today as one of the most widely practiced of the numerous existent Nyingma lineages. It is practiced by many masters and monasteries of all four main schools of Tibetan Buddhism, primarily due to its profound and essential nature.",
      },
      {
        kind: "reference",
        text: "For further reading about the Longchen Nyingtik lineage, consult Tulku Thöndup's Masters of Meditation and Miracles.",
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
    title: `${dict.common.longchenNyingtik} — MSB Japan`,
    description: first?.kind === "paragraph" ? first.text : undefined,
  };
}

export default async function LongchenNyingtikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LineageArticle
      title={dict.common.longchenNyingtik}
      blocks={content[locale].blocks}
      backHref={`/${locale}/lineage`}
      backLabel={dict.common.lineage}
    />
  );
}
