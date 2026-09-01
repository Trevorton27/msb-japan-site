import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.common?.videos ?? "Videos"} — MSB Japan` };
}

type Video = {
  id: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  youtubeId: string;
  category: string;
};

const dummyVideos: Video[] = [
  {
    id: "1",
    titleJa: "仏教入門：四聖諦",
    titleEn: "Introduction to Buddhism: The Four Noble Truths",
    descriptionJa: "仏教の基本的な教えである四聖諦について解説します。",
    descriptionEn: "An introduction to the Four Noble Truths, the foundation of Buddhist teaching.",
    youtubeId: "dQw4w9WgXcQ",
    category: "TEACHING",
  },
  {
    id: "2",
    titleJa: "瞑想ガイド：初心者向け",
    titleEn: "Meditation Guide for Beginners",
    descriptionJa: "初めての方のための瞑想の基本を学びましょう。",
    descriptionEn: "Learn the basics of meditation practice for beginners.",
    youtubeId: "dQw4w9WgXcQ",
    category: "MEDITATION",
  },
  {
    id: "3",
    titleJa: "法話：慈悲の実践",
    titleEn: "Dharma Talk: Practicing Compassion",
    descriptionJa: "日常生活での慈悲の実践について。",
    descriptionEn: "On practicing compassion in daily life.",
    youtubeId: "dQw4w9WgXcQ",
    category: "DHARMA_TALK",
  },
  {
    id: "4",
    titleJa: "マインドフルネスと日常生活",
    titleEn: "Mindfulness in Daily Life",
    descriptionJa: "忙しい日常の中でマインドフルネスを実践する方法。",
    descriptionEn: "How to practice mindfulness in your busy daily life.",
    youtubeId: "dQw4w9WgXcQ",
    category: "TEACHING",
  },
  {
    id: "5",
    titleJa: "菩提心について",
    titleEn: "On Bodhicitta",
    descriptionJa: "菩提心の意味と、それを育む方法について。",
    descriptionEn: "The meaning of bodhicitta and how to cultivate it.",
    youtubeId: "dQw4w9WgXcQ",
    category: "DHARMA_TALK",
  },
  {
    id: "6",
    titleJa: "坐禅の作法",
    titleEn: "Zazen Practice and Posture",
    descriptionJa: "正しい坐禅の姿勢と作法を解説します。",
    descriptionEn: "Guidance on proper zazen posture and practice.",
    youtubeId: "dQw4w9WgXcQ",
    category: "MEDITATION",
  },
];

const categoryLabels: Record<string, Record<string, string>> = {
  ja: { TEACHING: "教え", MEDITATION: "瞑想", DHARMA_TALK: "法話" },
  en: { TEACHING: "Teaching", MEDITATION: "Meditation", DHARMA_TALK: "Dharma Talk" },
};

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  const labels = categoryLabels[locale] ?? categoryLabels.en ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.common?.videos ?? "Videos"}
      </h1>
      <p className="mt-2 text-charcoal-600">
        {locale === "ja"
          ? "法話、瞑想ガイド、教えの動画をご覧ください。"
          : "Watch dharma talks, meditation guides, and teachings."}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyVideos.map((video) => {
          const title = locale === "en" ? video.titleEn : video.titleJa;
          const description = locale === "en" ? video.descriptionEn : video.descriptionJa;

          return (
            <div
              key={video.id}
              className="group overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-charcoal-100">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <svg
                      className="ml-1 h-6 w-6 text-charcoal-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute left-2 top-2">
                  <Badge variant="secondary" className="bg-white/90 text-xs">
                    {labels[video.category] ?? video.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-900 line-clamp-2">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-charcoal-500 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
