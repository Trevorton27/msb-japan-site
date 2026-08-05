import type { Metadata } from "next";
import Image from "next/image";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "History — MSB Japan"
        : "歴史 — MSB Japan",
  };
}

const content = {
  ja: {
    pageTitle: "歴史",
    briefHistoryTitle: "略歴：",
    p1: "尊者ジガル・コンツル・リンポチェは、チベット人の両親のもと、インド北部のヒマーチャル・プラデーシュ州で生まれました。父である第3代ネテン・チョクリン・リンポチェは、1959年に妻のマユム・ツェワン・パルドンと、長男・長女の2人の子供を連れてチベットから逃れました。チョクリン・リンポチェは、幻視によって見出した廃墟となった茶畑に、ペマ・エワム・チョーガル僧院を建立し、その周囲に難民の集落を築きました。チョクリン・リンポチェは、その生涯の残りの期間、彼らを慈しみ、その発展を導き続けました。コンチュル・リンポチェの母は、父と結婚する前に13年間閉関修行に専念しており、家族を移住させ、5人の子供を育てる多忙な日々の中でも、献身的な修行の生活を続けました。",
    p2: "ジャムゴン・コンチュル・ロドロ・タエの転生者として認定されたジガル・コンチュル・リンポチェは、僧院の環境で育ち、仏教教義のあらゆる側面について広範な訓練を受けました。特に、根本上師であるディルゴ・ケンツェ・リンポチェ法王から、ニンマ派の伝承、とりわけロンチェン・ニンティクの教えを授かった。また、トゥルク・ウルゲン・リンポチェ、ニョシュル・ケン・リンポチェ、そして偉大な学者ケンポ・リンチェンのもとでも幅広く学んだ。",
    p3: "1989年、リンポチェは妻と息子とともに米国に移住し、1990年にはナロパ大学で仏教哲学の教授として5年間の任期を開始しました。その後まもなく、リンポチェはディルゴ・キェンツェ・リンポチェ法王のサンスクリット語名にちなんで、「マンガラ・シュリ・ブティ・サンガ」を設立しました。マンガラ・シュリ・ブティは、ニンマ派のロンチェン・ニンティク伝承の智慧と実践に焦点を当てています。",
    p4: "MSBの主要な学習・実践センターである、コロラド州ボルダーの山間部にあるプンツォク・チョリンと、バーモント州ヴァーシャイアの田舎町近くにあるペマ・オセル・ド・ニャク・チョリンでは、一般向けに毎年学習・実践プログラムを提供しています。当団体の山岳リトリートセンターである「ロンチェン・ジグメ・サムテン・リン」は、その名が「恐れを知らぬ大いなる広がりの瞑想の場」を意味し、コロラド州クレストーンにあるサングレ・デ・クリスト山脈の壮観な麓に位置しています。サムテン・リンは当団体の至宝であり、修行生たちにリトリートを通じてダルマへの理解を深める機会を提供しています。サムテン・リンには、「知恵と慈悲のサングド・パルリ寺院」、グル・リンポチェの「栄光ある銅色の山の宮殿」、そして「ターラ・ゾン」があります。",
    p5: "学習者たちは、アメリカ国内外のマンガラム・ダルマ・シティ・センターに集まり、修行を行い、毎週のLINK法話に耳を傾け、ダルマを支えるために共に活動しています。当団体の活動について詳しくは、MSBセンターのページをご覧ください。",
    p6: "リンポチェは、MSBを通じて提供するコアカリキュラムに加え、米国や世界中の他のセンターを精力的に巡り、生徒たちの学習や実践を指導しています。教えや、自身の研鑽のための旅をしていないときは、サムテン・リン、あるいはインドのビルにあるマンガラ・シュリ・ブティの拠点であるグナ・インスティテュートで、閉関修行に専念しています。",
  },

  en: {
    pageTitle: "History",
    briefHistoryTitle: "A Brief History:",
    p1: "Venerable Dzigar Kongtrul Rinpoche was born in the Northern Indian province of Himachel Pradesh to Tibetan parents. His father, the third Neten Chokling Rinpoche, fled Tibet in 1959 with his wife, Mayum Tsewang Paldon, and their two eldest children. On an abandoned tea plantation he recognized from a vision, Chokling Rinpoche established Pema Ewam Choegar Monastery, and surrounding it, a refugee settlement. For the remainder of Chokling Rinpoche's life, he cared for and guided their development. Kongtrul Rinpoche's mother, having spent thirteen years in retreat before marrying his father, continued a life of devoted practice, even in the midst of transplanting her family and raising their five children.",
    p2: "Recognized as an incarnation of Jamgon Kongtrul Lodro Thaye, Dzigar Kongtrul Rinpoche grew up in a monastic environment and received extensive training in all aspects of Buddhist doctrine. In particular, he received the teachings of the Nyingma lineage, especially those of the Longchen Nyingtik, from his root teacher, His Holiness Dilgo Khyentse Rinpoche. Rinpoche also studied extensively under Tulku Urgyen Rinpoche, Nyoshul Khen Rinpoche, and the great scholar Khenpo Rinchen.",
    p3: "In 1989 Rinpoche moved to the United States with his wife and son, and in 1990 began a five-year tenure as a professor of Buddhist philosophy at Naropa University. Rinpoche soon founded the Mangala Shri Bhuti Sangha after the Sanskrit name of His Holiness Dilgo Khyentse Rinpoche. Mangala Shri Bhuti focuses on the wisdom and practice of the Longchen Nyingtik tradition of the Nyingma Lineage.",
    p4: "MSB's main study and practice centers, Phuntsok Choling in the mountains above Boulder, Colorado, and Pema Osel Do Ngak Choling near the rural town of Vershire, Vermont, offer annual study and practice programs to the public. Our mountain retreat center, Longchen Jigme Samten Ling, whose name means, \"a meditation place of the fearless great expanse\", is located in the spectacular foothills of the Sangre de Cristo Mountains in Crestone, Colorado. Samten Ling is the jewel of our organization and offers students the opportunity to deepen their understanding of the Dharma in retreat. Samten Ling is home to The Sangdo Palri Temple of Wisdom and Compassion, Guru Rinpoche's Palace of the Glorious Copper-Colored Mountain, and the Tara Dzong.",
    p5: "Students gather at Mangalam Dharma City Centers in America and abroad to practice, listen to the weekly LINK teachings, and work together in support of the Dharma. Please visit the MSB Centers page to learn more about our activities.",
    p6: "In addition to the core curriculum that Rinpoche offers through MSB, he also travels extensively to other centers in the U.S. and around the world to teach and guide students in their own studies and practice. When not teaching or traveling to further his own education, Rinpoche remains in retreat at Samten Ling or at the Guna Institute, Mangala Shri Bhuti's seat in Bir, India.",
  },
};

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = locale === "en" ? content.en : content.ja;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-4xl font-bold tracking-tight text-center">
        {t.pageTitle}
      </h1>

      <h2 className="text-charcoal-900 mt-12 text-2xl font-bold text-center">
        {t.briefHistoryTitle}
      </h2>

      {/* Paragraphs 1–2 with rinpochesParents floated left */}
      <div className="mt-6">
        <Image
          src="/images/legacy/rinpochesParents.png"
          alt=""
          width={280}
          height={360}
          className="float-left mr-6 mb-4 rounded-lg object-cover"
        />
        <p className="text-charcoal-600 leading-relaxed">{t.p1}</p>
        <p className="text-charcoal-600 mt-6 leading-relaxed">{t.p2}</p>
        <div className="clear-both" />
      </div>

      {/* Paragraph 3 with auspiciousRainbow floated right */}
      <div className="mt-10">
        <Image
          src="/images/legacy/auspiciousRainbow.png"
          alt=""
          width={280}
          height={200}
          className="float-right ml-6 mb-4 rounded-lg object-cover"
        />
        <p className="text-charcoal-600 leading-relaxed">{t.p3}</p>
        <div className="clear-both" />
      </div>

      {/* Paragraphs 4–5 */}
      <p className="text-charcoal-600 mt-6 leading-relaxed">{t.p4}</p>
      <p className="text-charcoal-600 mt-6 leading-relaxed">{t.p5}</p>

      {/* Final paragraph with dharmaFriends floated left */}
      {"p6" in t && (
        <div className="mt-10">
          <Image
            src="/images/legacy/dharmaFriends.png"
            alt=""
            width={320}
            height={220}
            className="float-left mr-6 mb-4 rounded-lg object-cover"
          />
          <p className="text-charcoal-600 leading-relaxed">{t.p6}</p>
          <div className="clear-both" />
        </div>
      )}
    </div>
  );
}
