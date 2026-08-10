import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getMemberResourceByIdAdmin } from "@/server/queries/member-resources";
import { MemberResourceForm } from "@/components/admin/member-resource-form";

export default async function AdminEditMemberResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const { id } = await params;
  const resource = await getMemberResourceByIdAdmin(id);
  if (!resource) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Member Resource</h1>
      <MemberResourceForm
        initialData={{
          id: resource.id,
          slugJa: resource.slugJa,
          slugEn: resource.slugEn ?? undefined,
          titleJa: resource.titleJa,
          titleEn: resource.titleEn ?? undefined,
          descriptionJa: resource.descriptionJa ?? undefined,
          descriptionEn: resource.descriptionEn ?? undefined,
          contentJa: resource.contentJa ?? undefined,
          contentEn: resource.contentEn ?? undefined,
          resourceType: resource.resourceType,
          fileUrl: resource.fileUrl ?? undefined,
          externalUrl: resource.externalUrl ?? undefined,
          videoUrl: resource.videoUrl ?? undefined,
          audioUrl: resource.audioUrl ?? undefined,
          published: resource.published,
          featured: resource.featured,
          sortOrder: resource.sortOrder,
        }}
      />
    </div>
  );
}
