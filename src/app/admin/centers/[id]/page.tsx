import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getCenterById } from "@/server/queries/centers";
import { CenterForm } from "@/components/admin/center-form";

export default async function EditCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const { id } = await params;
  const center = await getCenterById(id);
  if (!center) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Dharma Center</h1>
      <CenterForm
        initialData={{
          id: center.id,
          slugJa: center.slugJa,
          slugEn: center.slugEn ?? undefined,
          nameJa: center.nameJa,
          nameEn: center.nameEn ?? undefined,
          locationJa: center.locationJa ?? undefined,
          locationEn: center.locationEn ?? undefined,
          country: center.country ?? undefined,
          descriptionJa: center.descriptionJa ?? undefined,
          descriptionEn: center.descriptionEn ?? undefined,
          imageUrl: center.imageUrl ?? undefined,
          websiteUrl: center.websiteUrl ?? undefined,
          active: center.active,
          sortOrder: center.sortOrder,
        }}
      />
    </div>
  );
}
