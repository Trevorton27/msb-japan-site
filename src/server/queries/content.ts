"use server";

import { db } from "@/lib/db";
import type { ContentType, ContentStatus } from "@prisma/client";

export async function getPublishedPosts(filters?: {
  type?: ContentType;
  teacherId?: string;
}) {
  const where: Record<string, unknown> = {
    status: "PUBLISHED",
    OR: [
      { publishedAt: { lte: new Date() } },
      { publishedAt: null },
    ],
  };

  if (filters?.type) where.type = filters.type;
  if (filters?.teacherId) where.teacherId = filters.teacherId;

  return db.contentPost.findMany({
    where,
    include: { teacher: true, author: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPostBySlug(slug: string, locale: "ja" | "en") {
  const where = locale === "en" ? { slugEn: slug } : { slugJa: slug };

  return db.contentPost.findFirst({
    where: {
      ...where,
      status: "PUBLISHED",
      OR: [
        { publishedAt: { lte: new Date() } },
        { publishedAt: null },
      ],
    },
    include: { teacher: true, author: true },
  });
}

export async function getAllPostsAdmin(filters?: {
  type?: ContentType;
  status?: ContentStatus;
  search?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.type) where.type = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.search) {
    where.OR = [
      { titleJa: { contains: filters.search, mode: "insensitive" } },
      { titleEn: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return db.contentPost.findMany({
    where,
    include: { teacher: true, author: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPostById(id: string) {
  return db.contentPost.findUnique({
    where: { id },
    include: { teacher: true, author: true },
  });
}

export async function getTeachers() {
  return db.teacher.findMany({ orderBy: { sortOrder: "asc" } });
}
