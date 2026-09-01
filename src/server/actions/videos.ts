"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface VideoFormValues {
  titleJa: string;
  titleEn?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  category?: "TEACHING" | "MEDITATION" | "DHARMA_TALK";
  sortOrder?: number;
  published?: boolean;
}

export async function createVideo(data: VideoFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.video.create({
    data: {
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      youtubeUrl: data.youtubeUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      category: data.category ?? "TEACHING",
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? false,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/admin/videos");
  return { success: true };
}

export async function updateVideo(id: string, data: VideoFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  const existing = await db.video.findUnique({ where: { id } });

  await db.video.update({
    where: { id },
    data: {
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      youtubeUrl: data.youtubeUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      category: data.category ?? "TEACHING",
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? false,
      publishedAt:
        data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null,
    },
  });

  revalidatePath("/admin/videos");
  return { success: true };
}

export async function deleteVideo(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  await db.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  return { success: true };
}
