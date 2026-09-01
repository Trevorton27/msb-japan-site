import { notFound } from "next/navigation";
import { getVideoByIdAdmin } from "@/server/queries/videos";
import { VideoForm } from "@/components/admin/video-form";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoByIdAdmin(id);
  if (!video) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Edit Video
      </h1>
      <VideoForm
        initialData={{
          id: video.id,
          titleJa: video.titleJa,
          titleEn: video.titleEn ?? undefined,
          descriptionJa: video.descriptionJa ?? undefined,
          descriptionEn: video.descriptionEn ?? undefined,
          youtubeUrl: video.youtubeUrl,
          thumbnailUrl: video.thumbnailUrl ?? undefined,
          category: video.category,
          sortOrder: video.sortOrder,
          published: video.published,
        }}
      />
    </div>
  );
}
