import Link from "next/link";
import { getAllVideosAdmin } from "@/server/queries/videos";
import { Badge } from "@/components/ui/badge";

const categoryLabels: Record<string, string> = {
  TEACHING: "Teaching",
  MEDITATION: "Meditation",
  DHARMA_TALK: "Dharma Talk",
};

export default async function AdminVideosPage() {
  const videos = await getAllVideosAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Videos</h1>
        <Link
          href="/admin/videos/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {video.sortOrder}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <div className="font-medium">{video.titleJa}</div>
                    {video.titleEn && (
                      <div className="text-xs text-gray-500">{video.titleEn}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge variant="secondary">
                      {categoryLabels[video.category] ?? video.category}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge
                      variant="secondary"
                      className={
                        video.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {video.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Link
                      href={`/admin/videos/${video.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
