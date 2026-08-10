"use server";

import { db } from "@/lib/db";
import { requireMember, requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { ResourceType } from "@prisma/client";

export async function getPublishedMemberResources(filters?: {
  resourceType?: ResourceType;
}) {
  await requireMember();
  return db.memberResource.findMany({
    where: {
      published: true,
      ...(filters?.resourceType ? { resourceType: filters.resourceType } : {}),
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getMemberResourceBySlug(slug: string, locale: "ja" | "en") {
  await requireMember();
  const where =
    locale === "en"
      ? { OR: [{ slugEn: slug }, { slugJa: slug }], published: true }
      : { slugJa: slug, published: true };
  return db.memberResource.findFirst({ where });
}

export async function getFeaturedMemberResources(limit = 3) {
  await requireMember();
  return db.memberResource.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRecentMemberResources(limit = 3) {
  await requireMember();
  return db.memberResource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllMemberResourcesAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.memberResource.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getMemberResourceByIdAdmin(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  return db.memberResource.findUnique({ where: { id } });
}
