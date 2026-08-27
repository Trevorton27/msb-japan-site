"use server";

import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/rbac";

/** Returns upcoming published events visible to the current member. */
export async function getMemberUpcomingEvents(limit?: number) {
  const user = await requireMember();
  const currentUser = await db.user.findUnique({
    where: { id: user.id },
    select: { isSanghaMember: true },
  });

  const visibilityFilter = currentUser?.isSanghaMember
    ? {} // Sangha members see all events
    : { visibility: "PUBLIC" as const };

  return db.event.findMany({
    where: { status: "PUBLISHED", startsAt: { gte: new Date() }, ...visibilityFilter },
    include: { venue: true },
    orderBy: { startsAt: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

/** Returns the next single upcoming event with online URL for dashboard. */
export async function getMemberNextEvent() {
  const user = await requireMember();
  const currentUser = await db.user.findUnique({
    where: { id: user.id },
    select: { isSanghaMember: true },
  });

  const visibilityFilter = currentUser?.isSanghaMember
    ? {}
    : { visibility: "PUBLIC" as const };

  return db.event.findFirst({
    where: { status: "PUBLISHED", startsAt: { gte: new Date() }, ...visibilityFilter },
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
