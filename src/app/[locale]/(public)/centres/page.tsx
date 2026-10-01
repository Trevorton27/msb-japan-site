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
    title: dict.metadata?.centresTitle,
    description: dict.metadata?.centresDescription,
  };
}

type CentresContent = {
  centres: { id: string; name: string; paragraphs: string[] }[];
  reference: string;
};

// Text copied verbatim from docs/content-update/source-outline-v11.txt (section 2, 活動拠点).
const content = {
  ja: {
    centres: [
      {
        id: "kyoto",
        name: "タシ・ガチル（Tashi Gachil）（京都センター）",
        paragraphs: [
          "京都府亀岡市の田園風景が残る地域に位置する、築100年を超える古民家。MSBJのメイン・センターとして、年に一度リンポチェをお迎えしての法話会や、月一回の勉強会・座禅会を開催しています。タシ・ガチル（“Auspicious Coil of Joy”）は、「吉祥なる歓喜の円環」を意味します。",
        ],
      },
      {
        id: "izu",
        name: "タシ・チョリン（Tashi Choling）（南伊豆リトリート・センター）",
        paragraphs: [
          '南伊豆の海近くの高台に位置する、自然豊かな山荘。敷地内の能舞台にて、座禅会やドゥルプチュ（集中的な供養行）を行っています。タシ・チョリン（"Auspicious Place of Dharma"）は、吉祥なる仏法の地を意味します。',
        ],
      },
    ],
    reference: "（参考・米国側拠点：コロラド／バーモント／クレストン）",
  },
  en: {
    centres: [
      {
        id: "kyoto",
        name: "Tashi Gachil (Kyoto Center)",
        paragraphs: [
          "A farmhouse over 100 years old, located amid the rural scenery of Kameoka City, Kyoto Prefecture. As MSBJ's main center, Tashi Gachil hosts teaching gatherings with Rinpoche and other lineage teachers, as well as monthly study groups and meditation retreats. The name Tashi Gachil means “Auspicious Coil of Joy.”",
        ],
      },
      {
        id: "izu",
        name: "Tashi Choling (Minami-Izu Retreat Center)",
        paragraphs: [
          "A mountain lodge surrounded by nature, set on a high bluff overlooking the sea in Minami-Izu. Meditation retreats and drupchö (intensive tsok practice) are held in its practice hall, originally a Noh stage.",
          "Tashi Choling, means “Auspicious Place of Dharma.”",
        ],
      },
    ],
    reference:
      "(Reference — MSB centers in the U.S.: Colorado / Vermont / Crestone)",
  },
} satisfies Record<Locale, CentresContent>;

const images: Record<string, string[]> = {
  kyoto: ["/images/legacy/113186009.webp", "/images/legacy/113186010.webp"],
  izu: ["/images/legacy/113186011.webp", "/images/legacy/113186012.webp"],
};

export default async function CentresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const t = content[locale];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">
        {dict.centres?.title}
      </h1>

      <div className="mt-12 space-y-12">
        {t.centres.map((centre) => (
          <Card key={centre.id} id={centre.id} className="scroll-mt-48">
            <CardHeader>
              <CardTitle className="text-2xl">{centre.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              {centre.paragraphs.map((p) => (
                <p
                  key={p}
                  className="text-charcoal-600 mt-2 text-sm leading-relaxed first:mt-0"
                >
                  {p}
                </p>
              ))}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {(images[centre.id] ?? []).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={centre.name}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-charcoal-500 mt-12 text-sm">{t.reference}</p>
    </div>
  );
}
