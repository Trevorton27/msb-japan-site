import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  LineageArticle,
  type LineageBlock,
} from "@/components/public/lineage-article";

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 3-2).
const content = {
  ja: {
    blocks: [
      {
        kind: "paragraph",
        text: "仏教は、約2500年前（紀元前5世紀）、インドの王子ゴータマ・シッダールタがガヤの菩提樹の下で悟りを開き、その後サルナートの鹿野苑で自らの体験に基づいたシンプルな教えを説いたことに始まるとされています。その悟りがあまりに深甚であったことから、彼は「目覚めた者」、すなわちブッダとして知られるようになりました。ブッダの教え「仏法」は、物事の真理を意味し、日々の体験や心に直接向き合うことで苦しみを離れる、きわめて実践的な方法を説き明かしています。",
      },
      {
        kind: "paragraph",
        text: "ブッダが自らの身体・心・現象世界を調べることで見出した真理は、宗教や哲学、心理学というよりも、「生きるための指針」「悟りへの旅」と呼ぶほうがふさわしいかもしれません。彼は「生きとし生けるものには本来、智慧・慈悲・力が具わっているが、一時的な汚れに覆われているために苦しみを体験している」と説き、その汚れを取り除いて本来の徳性を顕わにする道を示しました。この悟りへの旅は、エゴの固定観念や良し悪しの分別を離れ、物事をあるがままに見て、その本性にくつろぐことを目指すものです。そのためブッダは、人それぞれの資質や目的に応じてさまざまな教えを説きましたが、それらは大きく3つに分けられます。",
      },
      {
        kind: "list",
        items: [
          "上座部仏教：ブッダの根本的な教えで、個人の解脱を目指す乗り物（小乗とも呼ばれる）",
          "大乗仏教：生きとし生けるものへの慈悲と、物事の究極の本性を分析、理解することを重視する、生きとし生けるものの悟りを目指す乗り物",
          "金剛乗（密教）：目的は大乗と同じだが、そこにすみやかに行き着くための様々な方便を有する乗り物",
        ],
      },
      {
        kind: "paragraph",
        text: "インドに始まった仏教は、その後アジアの多くの国々へ、近年ではさらに西洋へと広まりました。現在、上座部仏教は主に東南アジア（スリランカ、ミャンマー、タイ）、大乗仏教は東アジア（日本、中国、韓国）、金剛乗はネパール、チベット、ブータン、日本で実践されています。",
      },
    ],
  },
  en: {
    blocks: [
      {
        kind: "paragraph",
        text: "Buddhism is said to have begun about 2,500 years ago (5th century BCE), when the Indian prince Siddhartha Gautama attained enlightenment beneath the Bodhi tree in Bodh Gaya, and later taught a simple set of teachings at the Deer Park in Sarnath, based on his own experience. Because his enlightenment was so profound, he became known as “the Awakened One,” the Buddha. The Buddha's teaching, the Dharma, means the truth of things, and reveals an extremely practical method for freeing ourselves from suffering by engaging directly with our everyday experience and our mind.",
      },
      {
        kind: "paragraph",
        text: "The truth the Buddha discovered by examining his own body, mind, and the phenomenal world might be better described as “a guide for living” or “a journey to awakening” than as a religion, philosophy, or psychology. He taught that “all sentient beings inherently possess wisdom, compassion, and capability, but experience suffering because these are obscured by temporary defilements,” and showed a path for removing those defilements and revealing our innate qualities. This journey to awakening aims to release fixed ideas of ego and judgments of good and bad, to see things as they are, and to rest in their true nature. Because of this, the Buddha taught in many different ways suited to people's differing capacities and aims, which are broadly grouped into three.",
      },
      {
        kind: "list",
        items: [
          "Theravada: The Buddha's foundational teachings, a vehicle aimed at individual liberation (also called the Hinayana).",
          "Mahayana: A vehicle aimed at the awakening of all sentient beings, emphasizing compassion for all beings together with analysis and understanding of the ultimate nature of things.",
          "Vajrayana (Tantric Buddhism): Shares the same aim as the Mahayana, but offers a variety of skillful means to reach it swiftly.",
        ],
      },
      {
        kind: "paragraph",
        text: "Buddhism, which began in India, later spread across many countries in Asia and, in recent times, to the West as well. Today, Theravada is practiced mainly in Southeast Asia (Sri Lanka, Myanmar, Thailand), Mahayana in East Asia (Japan, China, Korea), and Vajrayana in Nepal, Tibet, Bhutan, and Japan.",
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
    title: `${dict.common.whatIsBuddhism} — MSB Japan`,
    description: first?.kind === "paragraph" ? first.text : undefined,
  };
}

export default async function BuddhismPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <LineageArticle
      title={dict.common.whatIsBuddhism}
      blocks={content[locale].blocks}
      backHref={`/${locale}/lineage`}
      backLabel={dict.common.lineage}
    />
  );
}
