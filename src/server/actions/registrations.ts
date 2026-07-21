"use server";

import { db } from "@/lib/db";
import { eventRegistrationSchema } from "@/lib/validation/schemas";
import type { EventRegistrationValues } from "@/lib/validation/schemas";

export async function registerForEvent(
  eventId: string,
  data: EventRegistrationValues
) {
  const parsed = eventRegistrationSchema.parse(data);

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        select: { id: true },
      },
    },
  });

  if (!event || event.status !== "PUBLISHED") {
    return { success: false, error: "Event not found or not open" };
  }

  if (
    event.registrationClosesAt &&
    new Date() > event.registrationClosesAt
  ) {
    return { success: false, error: "Registration is closed" };
  }

  const currentCount = event.registrations.length;
  const isWaitlisted = event.capacity ? currentCount >= event.capacity : false;

  const registration = await db.eventRegistration.create({
    data: {
      eventId,
      email: parsed.email,
      status: isWaitlisted ? "WAITLISTED" : "CONFIRMED",
      notes: parsed.notes,
      attendees: {
        create: parsed.attendees.map((a) => ({
          nameJa: a.nameJa,
          nameEn: a.nameEn,
          email: a.email,
        })),
      },
    },
  });

  // TODO: Send confirmation email via Resend

  return {
    success: true,
    status: registration.status,
    id: registration.id,
  };
}
