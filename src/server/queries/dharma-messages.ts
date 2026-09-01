"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

/** Returns the current dharma message for the homepage.
 *  Prefers the most recently cron-published message (has publishedAt).
 *  Falls back to the first published message by sortOrder if none have been cron-triggered yet. */
export async function getCurrentDharmaMessage() {
  const cronPublished = await db.dharmaMessage.findFirst({
    where: { published: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
  if (cronPublished) return cronPublished;

  // Fallback: show the first published message even before the cron runs
  return db.dharmaMessage.findFirst({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
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
