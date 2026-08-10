"use server";

import { db } from "@/lib/db";
import { requireMember, requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getPublishedAnnouncements(limit?: number) {
  await requireMember();
  return db.memberAnnouncement.findMany({
    where: { published: true },
    orderBy: [
      { pinned: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    ...(limit ? { take: limit } : {}),
  });
}

export async function getAllAnnouncementsAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.memberAnnouncement.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAnnouncementByIdAdmin(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.memberAnnouncement.findUnique({ where: { id } });
}
