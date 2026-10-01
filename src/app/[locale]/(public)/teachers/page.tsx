import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getTeachers } from "@/server/queries/content";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { parseBio } from "@/lib/content/bio";

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

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const teachers = await getTeachers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">
        {dict.teachers?.title}
      </h1>
      <p className="text-charcoal-600 mt-4">{dict.teachers?.description}</p>

      <div className="mt-12 space-y-8">
        {teachers.map((teacher) => {
          const name =
            locale === "en" && teacher.nameEn ? teacher.nameEn : teacher.nameJa;
          const bio =
            locale === "en" && teacher.bioEn ? teacher.bioEn : teacher.bioJa;
          const anchor =
            locale === "en" && teacher.slugEn ? teacher.slugEn : teacher.slugJa;

          const imageUrl =
            teacher.slugJa === "dzigar-kongtrul-rinpoche"
              ? "/images/rinpocheIntro.png"
              : teacher.imageUrl;

          return (
            <Card key={teacher.id} id={anchor} className="scroll-mt-48">
              <CardHeader>
                <CardTitle className="text-2xl">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-6 sm:flex-row">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-40 w-40 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="space-y-4">
                    {parseBio(bio ?? "").map((block, idx) => {
                      switch (block.kind) {
                        case "tagline":
                          return (
                            <p
                              key={idx}
                              className="text-burgundy-600 text-sm font-medium"
                            >
                              {block.text}
                            </p>
                          );
                        case "heading":
                          return (
                            <h3
                              key={idx}
                              className="text-charcoal-900 pt-2 text-lg font-semibold"
                            >
                              {block.text}
                            </h3>
                          );
                        case "quote":
                          return (
                            <blockquote
                              key={idx}
                              className="border-burgundy-500 text-charcoal-700 space-y-3 border-l-4 pl-4 text-sm leading-relaxed italic"
                            >
                              {block.paragraphs.map((q) => (
                                <p key={q}>{q}</p>
                              ))}
                              {block.source && (
                                <footer className="text-charcoal-500 text-xs not-italic">
                                  {block.source}
                                </footer>
                              )}
                            </blockquote>
                          );
                        default:
                          return (
                            <p
                              key={idx}
                              className="text-charcoal-600 text-sm leading-relaxed"
                            >
                              {block.text}
                            </p>
                          );
                      }
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
