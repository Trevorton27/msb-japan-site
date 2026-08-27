"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

/** Returns the most recently published dharma message (for homepage). */
export async function getCurrentDharmaMessage() {
  return db.dharmaMessage.findFirst({
    where: { published: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getAllDharmaMessagesAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.dharmaMessage.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getDharmaMessageByIdAdmin(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.dharmaMessage.findUnique({ where: { id } });
}
