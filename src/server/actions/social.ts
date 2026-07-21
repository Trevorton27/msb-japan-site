"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getSocialProvider } from "@/lib/social";
import { revalidatePath } from "next/cache";

export async function createSocialPost(data: {
  socialAccountId: string;
  contentPostId?: string;
  caption: string;
  mediaUrl?: string;
  scheduledAt?: string;
}) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  const status = data.scheduledAt ? "scheduled" : "draft";

  await db.socialPost.create({
    data: {
      socialAccountId: data.socialAccountId,
      contentPostId: data.contentPostId || null,
      caption: data.caption,
      mediaUrl: data.mediaUrl || null,
      status,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    },
  });

  revalidatePath("/admin/social");
  return { success: true };
}

export async function updateSocialPost(
  id: string,
  data: {
    caption?: string;
    mediaUrl?: string;
    scheduledAt?: string;
  }
) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  await db.socialPost.update({
    where: { id },
    data: {
      ...(data.caption !== undefined ? { caption: data.caption } : {}),
      ...(data.mediaUrl !== undefined
        ? { mediaUrl: data.mediaUrl || null }
        : {}),
      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            status: data.scheduledAt ? "scheduled" : "draft",
          }
        : {}),
    },
  });

  revalidatePath("/admin/social");
  return { success: true };
}

export async function deleteSocialPost(id: string) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  await db.socialPost.delete({ where: { id } });

  revalidatePath("/admin/social");
  return { success: true };
}

export async function publishSocialPost(id: string) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  const post = await db.socialPost.findUnique({
    where: { id },
    include: { socialAccount: true },
  });

  if (!post) return { success: false, error: "Post not found" };
  if (post.status === "published") {
    return { success: false, error: "Already published" };
  }

  const provider = getSocialProvider(post.socialAccount.platform);

  const result = await provider.publish({
    caption: post.caption ?? "",
    mediaUrl: post.mediaUrl ?? undefined,
    accessToken: post.socialAccount.accessToken,
    pageId: post.socialAccount.pageId ?? undefined,
  });

  if (!result.success) {
    await db.socialPost.update({
      where: { id },
      data: { status: "failed" },
    });
    revalidatePath("/admin/social");
    return { success: false, error: result.error };
  }

  await db.socialPost.update({
    where: { id },
    data: {
      status: "published",
      platformPostId: result.platformPostId ?? null,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/social");
  return { success: true };
}

export async function addSocialAccount(data: {
  platform: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  pageId?: string;
}) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  await db.socialAccount.create({
    data: {
      platform: data.platform,
      accountName: data.accountName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || null,
      tokenExpiresAt: data.tokenExpiresAt
        ? new Date(data.tokenExpiresAt)
        : null,
      pageId: data.pageId || null,
    },
  });

  revalidatePath("/admin/social");
  return { success: true };
}

export async function removeSocialAccount(id: string) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  await db.socialAccount.delete({ where: { id } });

  revalidatePath("/admin/social");
  return { success: true };
}
