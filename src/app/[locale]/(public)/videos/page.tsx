import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPublishedVideos } from "@/server/queries/videos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: `${dict.common.videoAudioArchive} — MSB Japan`,
    description: dict.resources.videoArchiveIntro,
  };
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

// Shown only while no videos are published, so the client can preview the
// layout. Remove once real videos are added in /admin/videos.
const PLACEHOLDER_CATEGORIES = ["TEACHING", "MEDITATION", "DHARMA_TALK"] as const;
const placeholderVideos = Array.from({ length: 10 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  titleJa: `サンプル動画タイトル ${i + 1}`,
  titleEn: `Sample Video Title ${i + 1}`,
  descriptionJa: "ここに動画の説明文が入ります。内容の概要を一、二行で紹介します。",
  descriptionEn:
    "A short description of the video goes here, summarizing its content in a line or two.",
  youtubeUrl: "",
  thumbnailUrl: null as string | null,
  category: PLACEHOLDER_CATEGORIES[i % PLACEHOLDER_CATEGORIES.length] as string,
}));

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

  const publishedVideos = await getPublishedVideos();
  const isPlaceholder = publishedVideos.length === 0;
  const videos = isPlaceholder ? placeholderVideos : publishedVideos;
  const labels = categoryLabels[locale] ?? categoryLabels.en ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.common.videoAudioArchive}
      </h1>
      <p className="mt-2 text-charcoal-600">{dict.resources.videoArchiveIntro}</p>

      {isPlaceholder && (
        <p className="mt-8 rounded-md border border-dashed border-charcoal-300 bg-charcoal-50 px-4 py-2 text-sm text-charcoal-500">
          {locale === "ja"
            ? "表示イメージ用のサンプルです。動画を公開すると置き換わります。"
            : "Sample layout preview. These will be replaced once videos are published."}
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const title = locale === "en" && video.titleEn ? video.titleEn : video.titleJa;
          const description =
            locale === "en" && video.descriptionEn
              ? video.descriptionEn
              : video.descriptionJa;
          const youtubeId = extractYoutubeId(video.youtubeUrl);
          const thumbnail =
            video.thumbnailUrl ??
            (youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : null);

          const Card = isPlaceholder ? "div" : "a";
          const linkProps = isPlaceholder
            ? {}
            : { href: video.youtubeUrl, target: "_blank", rel: "noopener noreferrer" };

          return (
            <Card
              key={video.id}
              {...linkProps}
              className="group overflow-hidden rounded-lg border border-charcoal-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-charcoal-100">
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                )}
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
                {description && (
                  <p className="mt-1 text-sm text-charcoal-500 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
