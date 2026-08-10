"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import type { ResourceType } from "@prisma/client";

export interface MemberResourceFormValues {
  slugJa: string;
  slugEn?: string;
  titleJa: string;
  titleEn?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  contentJa?: string;
  contentEn?: string;
  resourceType?: ResourceType;
  fileUrl?: string;
  externalUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  published?: boolean;
  featured?: boolean;
  sortOrder?: number;
}

export async function createMemberResource(data: MemberResourceFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.memberResource.create({
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      contentJa: data.contentJa || null,
      contentEn: data.contentEn || null,
      resourceType: data.resourceType ?? "ARTICLE",
      fileUrl: data.fileUrl || null,
      externalUrl: data.externalUrl || null,
      videoUrl: data.videoUrl || null,
      audioUrl: data.audioUrl || null,
      published: data.published ?? false,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/member-resources");
  return { success: true };
}

export async function updateMemberResource(id: string, data: MemberResourceFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  await db.memberResource.update({
    where: { id },
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      titleJa: data.titleJa,
      titleEn: data.titleEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      contentJa: data.contentJa || null,
      contentEn: data.contentEn || null,
      resourceType: data.resourceType ?? "ARTICLE",
      fileUrl: data.fileUrl || null,
      externalUrl: data.externalUrl || null,
      videoUrl: data.videoUrl || null,
      audioUrl: data.audioUrl || null,
      published: data.published ?? false,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/member-resources");
  return { success: true };
}

export async function deleteMemberResource(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  await db.memberResource.delete({ where: { id } });
  revalidatePath("/admin/member-resources");
  return { success: true };
}
