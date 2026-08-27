"use server";

import { db } from "@/lib/db";
import { requireMember, requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import {
  syncEventToGoogleCalendar,
  deleteEventFromGoogleCalendar,
} from "@/server/google-calendar/syncService";

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
    syncEventToCalendar(user.id, eventId);
    revalidatePath("/members/events");
    return { success: true };
  }

  await db.memberEventRegistration.create({
    data: { userId: user.id, eventId, status: "REGISTERED" },
  });

  syncEventToCalendar(user.id, eventId);
  revalidatePath("/members/events");
  return { success: true };
}

export async function cancelMemberEventRegistration(eventId: string) {
  const user = await requireMember();

  await db.memberEventRegistration.updateMany({
    where: { userId: user.id, eventId },
    data: { status: "CANCELLED" },
  });

  removeEventFromCalendar(user.id, eventId);
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

  syncEventToCalendar(userId, eventId);
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

  removeEventFromCalendar(userId, eventId);
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/members/events");
  return { success: true };
}

async function syncEventToCalendar(userId: string, eventId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { venue: true },
  });
  if (!event) return;
  syncEventToGoogleCalendar(userId, event).catch(console.error);
}

async function removeEventFromCalendar(userId: string, eventId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { venue: true },
  });
  if (!event) return;
  deleteEventFromGoogleCalendar(userId, event).catch(console.error);
}
