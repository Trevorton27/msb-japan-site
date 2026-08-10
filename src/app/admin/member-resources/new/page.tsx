import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { MemberResourceForm } from "@/components/admin/member-resource-form";

export default async function AdminNewMemberResourcePage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Member Resource</h1>
      <MemberResourceForm />
    </div>
  );
}
