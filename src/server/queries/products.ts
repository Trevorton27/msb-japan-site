"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getPublishedProducts() {
  return db.product.findMany({
    where: { active: true },
    include: {
      variants: {
        where: { active: true },
        orderBy: { priceAmount: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductBySlug(slug: string, locale: "ja" | "en") {
  const product = await db.product.findFirst({
    where: locale === "en"
      ? { OR: [{ slugEn: slug }, { slugJa: slug }], active: true }
      : { slugJa: slug, active: true },
    include: {
      variants: {
        where: { active: true },
        orderBy: { priceAmount: "asc" },
      },
    },
  });

  return product;
}

export async function getAllProductsAdmin() {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  return db.product.findMany({
    include: {
      variants: { orderBy: { priceAmount: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductById(id: string) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  return db.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { priceAmount: "asc" },
        include: {
          inventoryAdjustments: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      },
    },
  });
}
