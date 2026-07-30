import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
    title: dict.metadata?.centresTitle,
    description: dict.metadata?.centresDescription,
  };
}

const centres = [
  {
    id: "tashi-gachil",
    nameEn: "Tashi Gachil",
    nameJa: "タシ・ガチル",
    subtitleJa: "京都修学センター",
    subtitleEn: "Kyoto Study Centre",
    descriptionJa:
      "京都東山、善気山法然院の隣に位置する、緑に囲まれた静かな和風建築の山荘。MSBJのメイン・センターとして、年に一度のリンポチェをお迎えした法話会、月一の勉強会や座禅会を開催しています。タシ・ガチル、「Auspicious Coil of Joy」は「吉祥なる歓喜の円環」を意味します。",
    descriptionEn:
      'A quiet Japanese-style mountain villa surrounded by greenery in Higashiyama, Kyoto, next to Honen-in temple. As MSBJ\'s main centre it hosts the annual teachings with Rinpoche, and monthly study groups and zazen sessions. Tashi Gachil means "Auspicious Coil of Joy."',
    locationJa: "京都府京都市左京区 東山鹿ヶ谷",
    locationEn: "Higashiyama Shishigatani, Sakyo-ku, Kyoto",
    activitiesJa: "年次法話会、月次勉強会、座禅会、供養行",
    activitiesEn:
      "Annual teachings, monthly study groups, zazen sessions, tsok offerings",
    images: ["/images/legacy/113186009.webp", "/images/legacy/113186010.webp"],
  },
  {
    id: "tashi-choling",
    nameEn: "Tashi Choling",
    nameJa: "タシ・チョリン",
    subtitleJa: "南伊豆リトリート・センター",
    subtitleEn: "Minami-Izu Retreat Centre",
    descriptionJa:
      "南伊豆の海近くの高台に位置する、自然豊かな山荘。敷地内の能舞台にて、座禅会やドゥルプチュ（集中的な供養行）を行っています。タシ・チョリン、「Auspicious Place of Dharma」は、吉祥なる仏法の地を意味します。",
    descriptionEn:
      'A mountain villa rich in nature on high ground near the sea in Minami-Izu. Zazen sessions and drupchös (intensive group practice) are held on the Noh stage within the grounds. Tashi Choling means "Auspicious Place of Dharma."',
    locationJa: "静岡県賀茂郡南伊豆町",
    locationEn: "Minami-Izu, Kamo District, Shizuoka",
    activitiesJa: "座禅会、ドゥプチュ（集中供養行）、放生会",
    activitiesEn: "Zazen sessions, drupchös, life-release ceremony",
    images: ["/images/legacy/113186011.webp", "/images/legacy/113186012.webp"],
  },
];

export default async function CentresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">
        {dict.centres?.title}
      </h1>
      <p className="text-charcoal-600 mt-4">{dict.centres?.description}</p>

      <div className="mt-12 space-y-12">
        {centres.map((centre) => (
          <Card key={centre.id} id={centre.id} className="scroll-mt-24">
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === "ja"
                  ? `${centre.nameJa}（${centre.nameEn}）`
                  : centre.nameEn}
              </CardTitle>
              <CardDescription className="text-base">
                {locale === "ja" ? centre.subtitleJa : centre.subtitleEn}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <p className="text-charcoal-600 text-sm leading-relaxed">
                {locale === "ja" ? centre.descriptionJa : centre.descriptionEn}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {centre.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={locale === "ja" ? centre.nameJa : centre.nameEn}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
              <div className="text-charcoal-600 mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-charcoal-900 font-semibold">
                    {dict.centres?.location}:
                  </span>{" "}
                  {locale === "ja" ? centre.locationJa : centre.locationEn}
                </p>
                <p>
                  <span className="text-charcoal-900 font-semibold">
                    {dict.centres?.activities}:
                  </span>{" "}
                  {locale === "ja" ? centre.activitiesJa : centre.activitiesEn}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
