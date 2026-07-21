"use server";

import { db } from "@/lib/db";
import { requirePermission, getCurrentUser } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const contentPostSchema = z.object({
  slugJa: z.string().min(1).max(200),
  slugEn: z.string().max(200).optional(),
  titleJa: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional(),
  bodyJa: z.string().optional(),
  bodyEn: z.string().optional(),
  excerptJa: z.string().max(500).optional(),
  excerptEn: z.string().max(500).optional(),
  type: z.enum(["BLOG", "TEACHING", "ARTICLE", "AUDIO", "VIDEO"]),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  teacherId: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  scheduledAt: z.string().optional(),
});

export type ContentPostFormValues = z.infer<typeof contentPostSchema>;

export async function createContentPost(data: ContentPostFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_CREATE);
  const user = await getCurrentUser();

  const parsed = contentPostSchema.parse(data);

  const post = await db.contentPost.create({
    data: {
      ...parsed,
      authorId: user?.id,
      imageUrl: parsed.imageUrl || null,
      mediaUrl: parsed.mediaUrl || null,
      teacherId: parsed.teacherId || null,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/content");
  return { success: true, id: post.id };
}

export async function updateContentPost(id: string, data: ContentPostFormValues) {
  await requirePermission(PERMISSIONS.CONTENT_EDIT);

  const parsed = contentPostSchema.parse(data);
  const existing = await db.contentPost.findUnique({ where: { id } });

  const publishedAt =
    parsed.status === "PUBLISHED" && existing?.status !== "PUBLISHED"
      ? new Date()
      : existing?.publishedAt;

  await db.contentPost.update({
    where: { id },
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
      mediaUrl: parsed.mediaUrl || null,
      teacherId: parsed.teacherId || null,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      publishedAt,
    },
  });

  revalidatePath("/admin/content");
  revalidatePath("/ja/teachings");
  revalidatePath("/en/teachings");
  return { success: true };
}

export async function deleteContentPost(id: string) {
  await requirePermission(PERMISSIONS.CONTENT_EDIT);
  await db.contentPost.delete({ where: { id } });
  revalidatePath("/admin/content");
  return { success: true };
}

export async function updatePostStatus(
  id: string,
  status: "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED"
) {
  const requiredPerm =
    status === "PUBLISHED"
      ? PERMISSIONS.CONTENT_PUBLISH
      : status === "APPROVED"
        ? PERMISSIONS.CONTENT_REVIEW
        : PERMISSIONS.CONTENT_EDIT;

  await requirePermission(requiredPerm);

  const data: Record<string, unknown> = { status };
  if (status === "PUBLISHED") data.publishedAt = new Date();

  await db.contentPost.update({ where: { id }, data });

  revalidatePath("/admin/content");
  return { success: true };
}
