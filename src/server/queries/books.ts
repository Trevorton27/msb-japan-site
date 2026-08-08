"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getPublishedBooks() {
  return db.book.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBookBySlug(slug: string, locale: "ja" | "en") {
  const book = await db.book.findFirst({
    where:
      locale === "en"
        ? { OR: [{ slugEn: slug }, { slugJa: slug }], active: true }
        : { slugJa: slug, active: true },
  });

  return book;
}

export async function getAllBooksAdmin() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return db.book.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBookById(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return db.book.findUnique({
    where: { id },
  });
}
