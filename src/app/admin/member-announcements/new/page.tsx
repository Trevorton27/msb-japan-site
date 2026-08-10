import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { MemberAnnouncementForm } from "@/components/admin/member-announcement-form";

export default async function AdminNewMemberAnnouncementPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Announcement</h1>
      <MemberAnnouncementForm />
    </div>
  );
}
