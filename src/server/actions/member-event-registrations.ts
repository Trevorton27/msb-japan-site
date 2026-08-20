"use server";

import { db } from "@/lib/db";
import { requireMember, requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export async function registerForMemberEvent(eventId: string) {
  const user = await requireMember();

  const existing = await db.memberEventRegistration.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });

  if (existing) {
    if (existing.status === "CANCELLED") {
      await db.memberEventRegistration.update({
        where: { id: existing.id },
        data: { status: "REGISTERED" },
      });
    }
    revalidatePath("/members/events");
    return { success: true };
  }

  await db.memberEventRegistration.create({
    data: { userId: user.id, eventId, status: "REGISTERED" },
  });

  revalidatePath("/members/events");
  return { success: true };
}

export async function cancelMemberEventRegistration(eventId: string) {
  const user = await requireMember();

  await db.memberEventRegistration.updateMany({
    where: { userId: user.id, eventId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/members/events");
  return { success: true };
}

export async function adminRegisterMember(eventId: string, userId: string) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  const existing = await db.memberEventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (existing) {
    if (existing.status === "CANCELLED") {
      await db.memberEventRegistration.update({
        where: { id: existing.id },
        data: { status: "REGISTERED" },
      });
    }
  } else {
    await db.memberEventRegistration.create({
      data: { userId, eventId, status: "REGISTERED" },
    });
  }

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/members/events");
  return { success: true };
}

export async function adminRemoveMemberRegistration(
  eventId: string,
  userId: string
) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  await db.memberEventRegistration.updateMany({
    where: { userId, eventId },
    data: { status: "CANCELLED" },
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/members/events");
  return { success: true };
}
