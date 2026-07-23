import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllPostsAdmin } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentFilters } from "@/components/admin/content-filters";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";
import type { ContentType, ContentStatus } from "@prisma/client";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

const typeLabels: Record<string, string> = {
  BLOG: "Blog",
  TEACHING: "Teaching",
  ARTICLE: "Article",
  AUDIO: "Audio",
  VIDEO: "Video",
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_READ);
  const query = await searchParams;
  const [posts, locale] = await Promise.all([
    getAllPostsAdmin({
      type: query.type as ContentType | undefined,
      status: query.status as ContentStatus | undefined,
      search: query.search,
    }),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.content}</h1>
        <Link href="/admin/content/new">
          <Button>{l.newPost}</Button>
        </Link>
      </div>

      <ContentFilters />

      <div className="mt-4 rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{l.title}</th>
              <th className="px-4 py-3 font-medium">{l.type}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium">{l.author}</th>
              <th className="px-4 py-3 font-medium">{l.updated}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {t(locale, post.titleJa, post.titleEn)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {typeLabels[post.type] ?? post.type}
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[post.status] ?? ""} variant="secondary">
                    {post.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {post.author?.name ?? post.author?.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {post.updatedAt.toLocaleDateString(dateFmt)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/content/${post.id}`} className="text-blue-600 hover:underline">
                    {l.edit}
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {l.noContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
