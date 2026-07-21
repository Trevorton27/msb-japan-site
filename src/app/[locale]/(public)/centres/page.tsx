import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.centres?.title}
      </h1>
      <p className="mt-4 text-charcoal-600">{dict.centres?.description}</p>

      <div className="mt-12 space-y-12">
        <Card id="tashi-gachil" className="scroll-mt-24">
          <CardHeader>
            <CardTitle className="text-2xl">
              {dict.centres?.tashiGachil}
            </CardTitle>
            <CardDescription className="text-base">
              {dict.centres?.tashiGachilDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="space-y-3 text-sm text-charcoal-600">
              <p>
                <span className="font-semibold text-charcoal-900">
                  {dict.centres?.location}:
                </span>{" "}
                {locale === "ja" ? "東京都" : "Tokyo"}
              </p>
              <p>
                <span className="font-semibold text-charcoal-900">
                  {dict.centres?.activities}:
                </span>{" "}
                {locale === "ja"
                  ? "定期瞑想会、法話、勉強会"
                  : "Regular meditation sessions, dharma talks, study groups"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="tashi-choling" className="scroll-mt-24">
          <CardHeader>
            <CardTitle className="text-2xl">
              {dict.centres?.tashiCholing}
            </CardTitle>
            <CardDescription className="text-base">
              {dict.centres?.tashiCholingDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="space-y-3 text-sm text-charcoal-600">
              <p>
                <span className="font-semibold text-charcoal-900">
                  {dict.centres?.activities}:
                </span>{" "}
                {locale === "ja"
                  ? "集中リトリート、瞑想合宿"
                  : "Intensive retreats, meditation residencies"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
