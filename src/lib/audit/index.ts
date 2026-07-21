"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/rbac";

export async function auditLog(
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  let userId: string | null = null;
  try {
    const user = await getCurrentUser();
    userId = user?.id ?? null;
  } catch {
    // No authenticated user — that's fine for public actions
  }

  await db.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId: entityId ?? null,
      metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });
}
