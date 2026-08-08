"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getPublishedCenters() {
  return db.dharmaCenter.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCenterBySlug(slug: string, locale: "ja" | "en") {
  const center = await db.dharmaCenter.findFirst({
    where:
      locale === "en"
        ? { OR: [{ slugEn: slug }, { slugJa: slug }], active: true }
        : { slugJa: slug, active: true },
  });

  return center;
}

export async function getAllCentersAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return db.dharmaCenter.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCenterById(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return db.dharmaCenter.findUnique({
    where: { id },
  });
}
