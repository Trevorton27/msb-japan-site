"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface CenterFormValues {
  slugJa: string;
  slugEn?: string;
  nameJa: string;
  nameEn?: string;
  locationJa?: string;
  locationEn?: string;
  country?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  imageUrl?: string;
  websiteUrl?: string;
  active?: boolean;
  sortOrder?: number;
}

export async function createCenter(data: CenterFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.dharmaCenter.create({
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      nameJa: data.nameJa,
      nameEn: data.nameEn || null,
      locationJa: data.locationJa || null,
      locationEn: data.locationEn || null,
      country: data.country || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      websiteUrl: data.websiteUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/centers");
  return { success: true };
}

export async function updateCenter(id: string, data: CenterFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.dharmaCenter.update({
    where: { id },
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      nameJa: data.nameJa,
      nameEn: data.nameEn || null,
      locationJa: data.locationJa || null,
      locationEn: data.locationEn || null,
      country: data.country || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      websiteUrl: data.websiteUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/centers");
  revalidatePath(`/admin/centers/${id}`);
  return { success: true };
}

export async function deleteCenter(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.dharmaCenter.delete({ where: { id } });

  revalidatePath("/admin/centers");
  return { success: true };
}
