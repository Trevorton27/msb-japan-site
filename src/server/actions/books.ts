"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface BookFormValues {
  slugJa: string;
  slugEn?: string;
  titleJa: string;
  titleEn?: string;
  authorJa?: string;
  authorEn?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  imageUrl?: string;
  purchaseUrl?: string;
  active?: boolean;
  sortOrder?: number;
}

export async function createBook(data: BookFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.book.create({
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      authorJa: data.authorJa || null,
      authorEn: data.authorEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      purchaseUrl: data.purchaseUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/books");
  return { success: true };
}

export async function updateBook(id: string, data: BookFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.book.update({
    where: { id },
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      authorJa: data.authorJa || null,
      authorEn: data.authorEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      purchaseUrl: data.purchaseUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/books");
  revalidatePath(`/admin/books/${id}`);
  return { success: true };
}

export async function deleteBook(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.book.delete({ where: { id } });

  revalidatePath("/admin/books");
  return { success: true };
}
