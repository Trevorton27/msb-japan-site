import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getPostById, getTeachers } from "@/server/queries/content";
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { Badge } from "@/components/ui/badge";
import { ContentStatusActions } from "@/components/admin/content-status-actions";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_READ);
  const { id } = await params;
  const [post, teachers] = await Promise.all([getPostById(id), getTeachers()]);

  if (!post) notFound();

  const initialData = {
    id: post.id,
    slugJa: post.slugJa,
    slugEn: post.slugEn ?? undefined,
    titleJa: post.titleJa,
    titleEn: post.titleEn ?? undefined,
    bodyJa: post.bodyJa ?? undefined,
    bodyEn: post.bodyEn ?? undefined,
    excerptJa: post.excerptJa ?? undefined,
    excerptEn: post.excerptEn ?? undefined,
    type: post.type,
    status: post.status,
    teacherId: post.teacherId ?? undefined,
    imageUrl: post.imageUrl ?? undefined,
    mediaUrl: post.mediaUrl ?? undefined,
    scheduledAt: post.scheduledAt
      ? post.scheduledAt.toISOString().slice(0, 16)
      : undefined,
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <Badge variant="secondary">{post.status}</Badge>
      </div>

      <div className="mb-6">
        <ContentStatusActions id={post.id} currentStatus={post.status} />
      </div>

      <ContentForm initialData={initialData} teachers={teachers} />
    </div>
  );
}
