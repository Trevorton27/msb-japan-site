"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getPublishedVideos() {
  return db.video.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllVideosAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.video.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getVideoByIdAdmin(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.video.findUnique({ where: { id } });
}
