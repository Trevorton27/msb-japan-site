import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getTeachers } from "@/server/queries/content";
import { ContentForm } from "@/components/admin/content-form";

export default async function NewContentPage() {
  await requirePermission(PERMISSIONS.CONTENT_CREATE);
  const teachers = await getTeachers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Content Post</h1>
      <ContentForm teachers={teachers} />
    </div>
  );
}
