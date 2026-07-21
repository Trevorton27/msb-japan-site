"use server";

import { db } from "@/lib/db";
import type { EventMode } from "@prisma/client";

export async function getPublishedEvents(filters?: {
  mode?: EventMode;
  beginnerFriendly?: boolean;
  upcoming?: boolean;
}) {
  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (filters?.mode) {
    where.mode = filters.mode;
  }

  if (filters?.beginnerFriendly) {
    where.beginnerFriendly = true;
  }

  if (filters?.upcoming !== false) {
    where.startsAt = { gte: new Date() };
  }

  return db.event.findMany({
    where,
    include: { venue: true, series: true },
    orderBy: { startsAt: "asc" },
  });
}

export async function getEventBySlug(slug: string, locale: "ja" | "en") {
  const where =
    locale === "en" ? { slugEn: slug } : { slugJa: slug };

  return db.event.findFirst({
    where: { ...where, status: "PUBLISHED" },
    include: {
      venue: true,
      series: true,
      registrations: { select: { id: true, status: true } },
    },
  });
}

export async function getEventById(id: string) {
  return db.event.findUnique({
    where: { id },
    include: {
      venue: true,
      series: true,
      registrations: {
        include: { attendees: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getAllEventsAdmin() {
  return db.event.findMany({
    include: {
      venue: true,
      _count: { select: { registrations: true } },
    },
    orderBy: { startsAt: "desc" },
  });
}

export async function getVenues() {
  return db.venue.findMany({ orderBy: { nameJa: "asc" } });
}
