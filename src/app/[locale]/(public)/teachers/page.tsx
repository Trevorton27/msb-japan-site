import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

// Placeholder teacher data — will come from DB in later phases
const teachers = [
  {
    id: "tsoknyi-rinpoche",
    nameJa: "ツォクニ・リンポチェ",
    nameEn: "Tsoknyi Rinpoche",
    bioJa: "チベット仏教ニンマ派とカギュ派の両方の伝統を受け継ぐ瞑想指導者。マンガラ・シュリー・ブーティの精神的指導者です。",
    bioEn: "A meditation master who holds lineages in both the Nyingma and Kagyu traditions of Tibetan Buddhism. The spiritual director of Mangala Shri Bhuti.",
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
          <Card key={teacher.id}>
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === "ja" ? teacher.nameJa : teacher.nameEn}
              </CardTitle>
              <CardDescription className="mt-2 text-base leading-relaxed">
                {locale === "ja" ? teacher.bioJa : teacher.bioEn}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
