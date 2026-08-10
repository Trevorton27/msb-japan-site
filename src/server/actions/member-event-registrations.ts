"use server";

import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/rbac";
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
