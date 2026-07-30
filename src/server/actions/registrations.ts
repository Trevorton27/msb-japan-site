"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { eventRegistrationSchema } from "@/lib/validation/schemas";
import type { EventRegistrationValues } from "@/lib/validation/schemas";

export async function registerForEvent(
  eventId: string,
  data: EventRegistrationValues
) {
  const parsed = eventRegistrationSchema.parse(data);

  // Capacity check and insert run in one serializable transaction so two
  // concurrent registrations cannot both take the last spot.
  const attempt = () =>
    db.$transaction(
      async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: eventId },
          select: {
            status: true,
            capacity: true,
            registrationClosesAt: true,
          },
        });

        if (!event || event.status !== "PUBLISHED") {
          return {
            success: false as const,
            error: "Event not found or not open",
          };
        }

        if (
          event.registrationClosesAt &&
          new Date() > event.registrationClosesAt
        ) {
          return { success: false as const, error: "Registration is closed" };
        }

        const currentCount = await tx.eventRegistration.count({
          where: { eventId, status: { in: ["PENDING", "CONFIRMED"] } },
        });
        const isWaitlisted = event.capacity
          ? currentCount >= event.capacity
          : false;

        const registration = await tx.eventRegistration.create({
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

        return {
          success: true as const,
          status: registration.status,
          id: registration.id,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

  try {
    return await attempt();
  } catch (e) {
    // Serialization conflict with a concurrent registration — retry once.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2034"
    ) {
      return await attempt();
    }
    throw e;
  }
}
