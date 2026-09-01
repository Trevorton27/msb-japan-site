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
  return { title: `${dict.common?.videos ?? "Videos"} — MSB Japan` };
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

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

  const videos = await getPublishedVideos();
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

      {videos.length === 0 ? (
        <p className="mt-8 text-charcoal-500">
          {locale === "ja"
            ? "まだ公開された動画はありません。"
            : "No published videos yet."}
        </p>
      ) : (
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

            return (
              <a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
