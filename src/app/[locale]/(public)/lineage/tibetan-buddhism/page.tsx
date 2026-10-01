import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  LineageArticle,
  type LineageBlock,
} from "@/components/public/lineage-article";

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 3-3).
const content = {
  ja: {
    blocks: [
      {
        kind: "paragraph",
        text: "チベット仏教は、上座部・大乗・金剛乗という3つの乗り物すべてを取り入れ、これを仏教の実践と教学における段階的な道として捉えている点に特徴があります。",
      },
      {
        kind: "paragraph",
        text: "チベットに仏教が初めて伝わったのは7世紀のことです。チベット統一を果たしたソンツェン・ガンポ王が、ネパールと唐から嫁いだ2人の王妃の勧めで仏教に帰依し、首都ラサにトゥルナン寺を建立しました。次のティソン・デツェン王の代には仏教が国教と定められ、インドのナーランダー大僧院からシャーンタラクシタとパドマサンバヴァを招いてサムイェー寺を建立、顕密（大乗顕教と金剛乗密教）の仏典がチベット語に翻訳されました。その後、王朝の滅亡とともに仏教は一時衰退しますが、11世紀にインドから入国したアティーシャらによって再興がなされました。",
      },
      {
        kind: "paragraph",
        text: "チベット仏教の特徴は、後期密教の教えを幅広く受け入れて独自に消化した点、そして顕教においては中観派の思想を含むインド大乗仏教の系譜を継承・保全してきた点にあります。また顕教では、存在や認識をめぐる教学・論争を通じて、論理的思考力と正確な概念知を養うことが重視されています。その思想の骨格をなす重要な論書には、シャーンティデーヴァ『入菩薩行論』(Bodhisattvacaryāvatāra)、マイトレーヤ『究竟一乗宝性論』(Uttaratantra Shastra)、『現観荘厳論』(Abhisamayalamkara) などがあり、ほかにもアティーシャらが説いたロジョン（心の修行）の教えが全宗派で重んじられています。",
      },
      {
        kind: "paragraph",
        text: "現在は大きく、ニンマ派、カギュ派、ゲルク派、サキャ派の4つの宗派に分かれています。",
      },
    ],
  },
  en: {
    blocks: [
      {
        kind: "paragraph",
        text: "Tibetan Buddhism is distinctive in that it comprehensively incorporates all three vehicles—Theravada, Mahayana, and Vajrayana—and regards them together as a graduated path of Buddhist practice and study.",
      },
      {
        kind: "paragraph",
        text: "Buddhism first reached Tibet in the 7th century. King Songtsen Gampo, who unified Tibet, took refuge in Buddhism at the urging of his two wives—princesses from Nepal and Tang China—and built Trulnang Temple in the capital, Lhasa. Under the next king, Trisong Detsen, Buddhism was established as the state religion; Shantarakshita and Padmasambhava were invited from Nalanda Monastery in India to build Samye Monastery, and the sutras of both the Mahayana and Vajrayana were translated into Tibetan. Buddhism later declined for a time following the fall of the dynasty, but was revived in the 11th century by Atisha and others who came from India.",
      },
      {
        kind: "paragraph",
        text: "Tibetan Buddhism is characterized by its broad adoption and independent assimilation of the later tantric teachings, and, on the sutra side, by its preservation of the lineage of Indian Mahayana Buddhism, including Madhyamaka thought. In its sutra tradition it also places great emphasis on cultivating logical reasoning and precise conceptual understanding through scholastic study and debate on questions of existence and perception. Key treatises forming the backbone of this thought include Shantideva's Bodhisattvacharyavatara (The Way of the Bodhisattva), Maitreya's Uttaratantra Shastra and Abhisamayalamkara, along with the Lojong (mind training) teachings of Atisha and others, which are valued across all schools.",
      },
      {
        kind: "paragraph",
        text: "Today, Tibetan Buddhism is broadly divided into four schools: Nyingma, Kagyu, Gelug, and Sakya.",
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
    title: `${dict.common.tibetanBuddhism} — MSB Japan`,
    description: first?.kind === "paragraph" ? first.text : undefined,
  };
}

export default async function TibetanBuddhismPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LineageArticle
      title={dict.common.tibetanBuddhism}
      blocks={content[locale].blocks}
      backHref={`/${locale}/lineage`}
      backLabel={dict.common.lineage}
    />
  );
}
