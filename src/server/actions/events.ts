"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const eventSchema = z.object({
  slugJa: z.string().min(1).max(200),
  slugEn: z.string().max(200).optional(),
  titleJa: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional(),
  descriptionJa: z.string().optional(),
  descriptionEn: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]),
  mode: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]),
  priceType: z.enum(["FREE", "FIXED", "DONATION", "SLIDING_SCALE"]),
  priceAmount: z.number().int().nonnegative().optional(),
  capacity: z.number().int().positive().optional(),
  beginnerFriendly: z.boolean().default(false),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  registrationOpensAt: z.string().optional(),
  registrationClosesAt: z.string().optional(),
  venueId: z.string().optional(),
  onlineUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  seriesId: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export async function createEvent(data: EventFormValues) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  const parsed = eventSchema.parse(data);

  const event = await db.event.create({
    data: {
      ...parsed,
      startsAt: new Date(parsed.startsAt),
      endsAt: new Date(parsed.endsAt),
      registrationOpensAt: parsed.registrationOpensAt
        ? new Date(parsed.registrationOpensAt)
        : null,
      registrationClosesAt: parsed.registrationClosesAt
        ? new Date(parsed.registrationClosesAt)
        : null,
      onlineUrl: parsed.onlineUrl || null,
      imageUrl: parsed.imageUrl || null,
      seriesId: parsed.seriesId || null,
      venueId: parsed.venueId || null,
    },
  });

  revalidatePath("/admin/events");
  return { success: true, id: event.id };
}

export async function updateEvent(id: string, data: EventFormValues) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  const parsed = eventSchema.parse(data);

  await db.event.update({
    where: { id },
    data: {
      ...parsed,
      startsAt: new Date(parsed.startsAt),
      endsAt: new Date(parsed.endsAt),
      registrationOpensAt: parsed.registrationOpensAt
        ? new Date(parsed.registrationOpensAt)
        : null,
      registrationClosesAt: parsed.registrationClosesAt
        ? new Date(parsed.registrationClosesAt)
        : null,
      onlineUrl: parsed.onlineUrl || null,
      imageUrl: parsed.imageUrl || null,
      seriesId: parsed.seriesId || null,
      venueId: parsed.venueId || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/ja/events`);
  revalidatePath(`/en/events`);
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  await db.event.delete({ where: { id } });

  revalidatePath("/admin/events");
  return { success: true };
}
