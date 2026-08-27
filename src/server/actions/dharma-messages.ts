"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface DharmaMessageFormValues {
  quoteJa: string;
  quoteEn?: string;
  attributionJa: string;
  attributionEn?: string;
  sourceJa?: string;
  sourceEn?: string;
  sortOrder?: number;
  published?: boolean;
}

export async function createDharmaMessage(data: DharmaMessageFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.dharmaMessage.create({
    data: {
      quoteJa: data.quoteJa,
      quoteEn: data.quoteEn || null,
      attributionJa: data.attributionJa,
      attributionEn: data.attributionEn || null,
      sourceJa: data.sourceJa || null,
      sourceEn: data.sourceEn || null,
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? false,
    },
  });

  revalidatePath("/admin/dharma-messages");
  return { success: true };
}

export async function updateDharmaMessage(
  id: string,
  data: DharmaMessageFormValues
) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.dharmaMessage.update({
    where: { id },
    data: {
      quoteJa: data.quoteJa,
      quoteEn: data.quoteEn || null,
      attributionJa: data.attributionJa,
      attributionEn: data.attributionEn || null,
      sourceJa: data.sourceJa || null,
      sourceEn: data.sourceEn || null,
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? false,
    },
  });

  revalidatePath("/admin/dharma-messages");
  return { success: true };
}

export async function deleteDharmaMessage(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  await db.dharmaMessage.delete({ where: { id } });
  revalidatePath("/admin/dharma-messages");
  return { success: true };
}
