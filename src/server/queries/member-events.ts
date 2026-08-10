"use server";

import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/rbac";

/** Returns upcoming published events including online meeting URL (member-only). */
export async function getMemberUpcomingEvents(limit?: number) {
  await requireMember();
  return db.event.findMany({
    where: { status: "PUBLISHED", startsAt: { gte: new Date() } },
    include: { venue: true },
    orderBy: { startsAt: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

/** Returns the next single upcoming event with online URL for dashboard. */
export async function getMemberNextEvent() {
  await requireMember();
  return db.event.findFirst({
    where: { status: "PUBLISHED", startsAt: { gte: new Date() } },
    include: { venue: true },
    orderBy: { startsAt: "asc" },
  });
}

/** Returns a member's event registrations. */
export async function getMemberEventRegistrations(userId: string) {
  await requireMember();
  return db.memberEventRegistration.findMany({
    where: { userId },
    include: { event: { include: { venue: true } } },
    orderBy: { createdAt: "desc" },
  });
}
