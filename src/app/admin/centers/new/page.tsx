import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { CenterForm } from "@/components/admin/center-form";

export default async function NewCenterPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Dharma Center</h1>
      <CenterForm />
    </div>
  );
}
