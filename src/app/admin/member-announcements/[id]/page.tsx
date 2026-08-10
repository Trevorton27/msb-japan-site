import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAnnouncementByIdAdmin } from "@/server/queries/member-announcements";
import { MemberAnnouncementForm } from "@/components/admin/member-announcement-form";

export default async function AdminEditMemberAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const { id } = await params;
  const announcement = await getAnnouncementByIdAdmin(id);
  if (!announcement) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Announcement</h1>
      <MemberAnnouncementForm
        initialData={{
          id: announcement.id,
          titleJa: announcement.titleJa,
          titleEn: announcement.titleEn ?? undefined,
          contentJa: announcement.contentJa,
          contentEn: announcement.contentEn ?? undefined,
          published: announcement.published,
          pinned: announcement.pinned,
        }}
      />
    </div>
  );
}
