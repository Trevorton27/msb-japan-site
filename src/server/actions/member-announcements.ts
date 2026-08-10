"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface MemberAnnouncementFormValues {
  titleJa: string;
  titleEn?: string;
  contentJa: string;
  contentEn?: string;
  published?: boolean;
  pinned?: boolean;
}

export async function createMemberAnnouncement(data: MemberAnnouncementFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.memberAnnouncement.create({
    data: {
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      contentJa: data.contentJa,
      contentEn: data.contentEn || null,
      published: data.published ?? false,
      pinned: data.pinned ?? false,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/admin/member-announcements");
  return { success: true };
}

export async function updateMemberAnnouncement(
  id: string,
  data: MemberAnnouncementFormValues
) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  const existing = await db.memberAnnouncement.findUnique({ where: { id } });

  await db.memberAnnouncement.update({
    where: { id },
    data: {
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      contentJa: data.contentJa,
      contentEn: data.contentEn || null,
      published: data.published ?? false,
      pinned: data.pinned ?? false,
      publishedAt:
        data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null,
    },
  });

  revalidatePath("/admin/member-announcements");
  return { success: true };
}

export async function deleteMemberAnnouncement(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  await db.memberAnnouncement.delete({ where: { id } });
  revalidatePath("/admin/member-announcements");
  return { success: true };
}
