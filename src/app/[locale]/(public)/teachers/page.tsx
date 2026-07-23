import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.teachersTitle,
    description: dict.metadata?.teachersDescription,
  };
}

const teachers = [
  {
    id: "dzigar-kongtrul-rinpoche",
    nameEn: "Dzigar Kongtrul Rinpoche",
    nameJa: "ジガー・コントゥル・リンポチェ",
    bioEn: [
      "Born in Himachal Pradesh, India, to Tibetan refugee parents.",
      "Recognized as an incarnation (tulku) of the 19th-century master Jamgön Kongtrul Lodrö Thayé.",
      "Raised in a monastic environment and received extensive training in Tibetan Buddhist philosophy and meditation.",
      "His principal (root) teacher was Dilgo Khyentse Rinpoche, and he also studied with renowned masters including Tulku Urgyen Rinpoche and Nyoshul Khen Rinpoche.",
      "Moved to the United States in 1989 and served as a professor of Buddhist philosophy at Naropa University.",
      "Founded Mangala Shri Bhuti to establish and transmit the Longchen Nyingtik tradition in the West.",
      "Author of several books, including It's Up to You, Light Comes Through, and Diligence.",
    ],
    bioJa: [
      "インド・ヒマーチャル・プラデーシュ州にてチベット難民の両親のもとに生まれる。",
      "19世紀の大師ジャムゴン・コントゥル・ロドゥ・タイェの転生者（トゥルク）として認定される。",
      "僧院環境で育ち、チベット仏教の哲学と瞑想について広範な修行を積む。",
      "根本の師はディルゴ・キェンツェ・リンポチェであり、トゥルク・ウゲン・リンポチェやニョシュル・ケン・リンポチェなど著名な師にも師事した。",
      "1989年に渡米し、ナロパ大学にて仏教哲学の教授を務める。",
      "ロンチェン・ニンティク（龍欽心髄）の伝統を西洋に確立・伝承するためにマンガラ・シュリー・ブーティを設立。",
      "著書に『It's Up to You』『Light Comes Through』『Diligence』などがある。",
    ],
  },
  {
    id: "dungse-jampal-norbu",
    nameEn: "Dungse Jampal Norbu",
    nameJa: "ドゥンセ・ジャンパル・ノルブ",
    bioEn: [
      "Son and designated Dharma heir of Dzigar Kongtrul Rinpoche.",
      "Raised within the Buddhist tradition and has studied the Dharma since childhood.",
      "Completed a five-year Translator's Degree Program in Bir, India, receiving a traditional shedra education focused on classical Indian Buddhist texts and Tibetan-English translation.",
      "Dilgo Khyentse Rinpoche instructed Dzigar Kongtrul Rinpoche to train him to carry on the lineage.",
      "Regularly teaches internationally and undertakes an annual 100-day retreat.",
      "Hosts the EveryBodhi Podcast, which presents Mahayana Buddhist teachings for contemporary practitioners.",
    ],
    bioJa: [
      "ジガー・コントゥル・リンポチェの息子であり、法嗣として指名されている。",
      "仏教の伝統の中で育ち、幼少期から仏法を学ぶ。",
      "インド・ビールにて5年間の翻訳学位プログラムを修了。古典インド仏教文献とチベット語・英語翻訳に焦点を当てた伝統的なシェドラ教育を受ける。",
      "ディルゴ・キェンツェ・リンポチェがジガー・コントゥル・リンポチェに、彼を法脈の継承者として育てるよう指示した。",
      "世界各地で定期的に教えを行い、毎年100日間のリトリートに入る。",
      "現代の修行者に向けた大乗仏教の教えを紹介するポッドキャスト「EveryBodhi Podcast」のホストを務める。",
    ],
  },
  {
    id: "elizabeth-mattis-namgyel",
    nameEn: "Elizabeth Mattis Namgyel",
    nameJa: "エリザベス・マティス・ナムゲル",
    bioEn: [
      "American Buddhist teacher and author.",
      "Has studied and practiced Buddhism since 1985 under Dzigar Kongtrul Rinpoche.",
      "Completed more than six years in retreat.",
      "Appointed Retreat Master at MSB's Samten Ling retreat center in Colorado.",
      "Holds a B.A. in Anthropology and an M.A. in Buddhist Studies.",
      "Founder and President of The Middle Way Initiative.",
      "Author of The Power of an Open Question and The Logic of Faith.",
      "Edited two of Dzigar Kongtrul Rinpoche's books and teaches internationally on Buddhist philosophy and contemplative practice.",
    ],
    bioJa: [
      "アメリカ人の仏教指導者・著述家。",
      "1985年よりジガー・コントゥル・リンポチェのもとで仏教を学び、修行を続ける。",
      "6年以上のリトリートを修了。",
      "コロラド州にあるMSBのサムテン・リン・リトリートセンターのリトリート・マスターに任命される。",
      "文化人類学の学士号と仏教学の修士号を取得。",
      "ミドル・ウェイ・イニシアティブの創設者・代表。",
      "著書に『The Power of an Open Question』『The Logic of Faith』がある。",
      "ジガー・コントゥル・リンポチェの著書2冊の編集を手がけ、仏教哲学と瞑想実践について世界各地で教えている。",
    ],
  },
];

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.teachers?.title}
      </h1>
      <p className="mt-4 text-charcoal-600">{dict.teachers?.description}</p>

      <div className="mt-12 space-y-8">
        {teachers.map((teacher) => (
          <Card key={teacher.id} id={teacher.id}>
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === "ja" ? teacher.nameJa : teacher.nameEn}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-2 text-sm leading-relaxed text-charcoal-600">
                {(locale === "ja" ? teacher.bioJa : teacher.bioEn).map(
                  (point, i) => (
                    <li key={i}>{point}</li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
