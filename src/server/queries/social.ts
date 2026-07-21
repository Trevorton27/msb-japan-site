"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getSocialAccounts() {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  return db.socialAccount.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true } },
    },
  });
}

export async function getSocialPosts(filters?: {
  status?: string;
  accountId?: string;
}) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  return db.socialPost.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : undefined),
      ...(filters?.accountId
        ? { socialAccountId: filters.accountId }
        : undefined),
    },
    include: { socialAccount: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSocialPostById(id: string) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  return db.socialPost.findUnique({
    where: { id },
    include: { socialAccount: true },
  });
}
