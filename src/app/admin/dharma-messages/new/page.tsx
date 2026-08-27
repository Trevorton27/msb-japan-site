import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { DharmaMessageForm } from "@/components/admin/dharma-message-form";

export default async function AdminNewDharmaMessagePage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Dharma Message</h1>
      <DharmaMessageForm />
    </div>
  );
}
