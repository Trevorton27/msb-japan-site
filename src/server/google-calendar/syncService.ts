import { db } from "@/lib/db";
import { calendar_v3 } from "googleapis";
import {
  getDecryptedTokens,
  getValidAccessToken,
  updateLastSyncTime,
  disableSync,
} from "./tokenManager";
import {
  createGoogleCalendarClient,
  retryWithBackoff,
  GoogleCalendarAuthError,
  GoogleCalendarNotFoundError,
} from "./googleCalendarClient";
import type { Event, Venue, EventMode } from "@prisma/client";

type EventWithVenue = Event & { venue?: Venue | null };

export interface SyncResult {
  success: boolean;
  googleEventId?: string;
  error?: string;
}

export interface BatchSyncResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: Array<{ eventId: string; error: string }>;
}

export async function syncEventToGoogleCalendar(
  userId: string,
  event: EventWithVenue
): Promise<SyncResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });
    if (!user || !user.googleCalendarSyncEnabled) return { success: true };

    const calendarId = user.googleCalendarId || "primary";
    const accessToken = await getValidAccessToken(userId);
    const tokens = await getDecryptedTokens(userId);
    if (!tokens) throw new Error("No tokens available");

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    const googleEvent = convertToGoogleCalendarEvent(event);

    const existingUserEvent = await db.userGoogleCalendarEvent.findUnique({
      where: { userId_eventId: { userId, eventId: event.id } },
    });

    let googleEventId: string;

    if (existingUserEvent) {
      try {
        const result = await retryWithBackoff(() =>
          client.updateEvent(
            calendarId,
            existingUserEvent.googleEventId,
            googleEvent
          )
        );
        googleEventId = result.id!;

        if (googleEventId !== existingUserEvent.googleEventId) {
          await db.userGoogleCalendarEvent.update({
            where: { id: existingUserEvent.id },
            data: { googleEventId, googleCalendarId: calendarId },
          });
        }
      } catch (updateError: unknown) {
        if (updateError instanceof GoogleCalendarNotFoundError) {
          const result = await retryWithBackoff(() =>
            client.createEvent(calendarId, googleEvent)
          );
          googleEventId = result.id!;
          await db.userGoogleCalendarEvent.update({
            where: { id: existingUserEvent.id },
            data: { googleEventId, googleCalendarId: calendarId },
          });
        } else {
          throw updateError;
        }
      }
    } else {
      const result = await retryWithBackoff(() =>
        client.createEvent(calendarId, googleEvent)
      );
      googleEventId = result.id!;
      await db.userGoogleCalendarEvent.create({
        data: {
          userId,
          eventId: event.id,
          googleEventId,
          googleCalendarId: calendarId,
        },
      });
    }

    return { success: true, googleEventId };
  } catch (error: unknown) {
    if (error instanceof GoogleCalendarAuthError) {
      await disableSync(userId);
      return {
        success: false,
        error: "Auth failed. Please reconnect Google Calendar.",
      };
    }
    return {
      success: false,
      error: (error as Error).message || "Failed to sync event",
    };
  }
}

export async function deleteEventFromGoogleCalendar(
  userId: string,
  event: EventWithVenue
): Promise<SyncResult> {
  try {
    const userEvent = await db.userGoogleCalendarEvent.findUnique({
      where: { userId_eventId: { userId, eventId: event.id } },
    });
    if (!userEvent) return { success: true };

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });

    if (!user || !user.googleCalendarSyncEnabled) {
      await db.userGoogleCalendarEvent.delete({ where: { id: userEvent.id } });
      return { success: true };
    }

    const calendarId = user.googleCalendarId || "primary";
    const accessToken = await getValidAccessToken(userId);
    const tokens = await getDecryptedTokens(userId);
    if (!tokens) throw new Error("No tokens available");

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    await retryWithBackoff(() =>
      client.deleteEvent(calendarId, userEvent.googleEventId)
    );
    await db.userGoogleCalendarEvent.delete({ where: { id: userEvent.id } });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof GoogleCalendarNotFoundError) {
      await db.userGoogleCalendarEvent
        .deleteMany({
          where: { userId, eventId: event.id },
        })
        .catch(() => {});
      return { success: true };
    }
    return { success: false, error: (error as Error).message };
  }
}

export async function batchSyncEvents(
  userId: string
): Promise<BatchSyncResult> {
  const result: BatchSyncResult = {
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  const events = await getEventsVisibleToUser();
  result.total = events.length;

  const existingMappings = await db.userGoogleCalendarEvent.findMany({
    where: { userId, eventId: { in: events.map((e) => e.id) } },
    select: { eventId: true },
  });
  const existingEventIds = new Set(existingMappings.map((m) => m.eventId));

  const BATCH_SIZE = 10;
  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((event) => syncEventToGoogleCalendar(userId, event))
    );

    results.forEach((promiseResult, index) => {
      const event = batch[index]!;
      if (
        promiseResult.status === "fulfilled" &&
        promiseResult.value.success
      ) {
        if (existingEventIds.has(event.id)) result.updated++;
        else result.created++;
      } else {
        result.failed++;
        result.errors.push({
          eventId: event.id,
          error:
            promiseResult.status === "fulfilled"
              ? promiseResult.value.error || "Unknown"
              : (promiseResult.reason as Error)?.message || "Unknown",
        });
      }
    });

    if (i + BATCH_SIZE < events.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  await updateLastSyncTime(userId);
  return result;
}

export async function syncEventToAllRelevantUsers(
  event: EventWithVenue
): Promise<void> {
  try {
    const relevantUsers = await getUsersWhoShouldSeeEvent(event);
    await Promise.allSettled(
      relevantUsers.map((user) => syncEventToGoogleCalendar(user.id, event))
    );
  } catch (error) {
    console.error("Failed to sync event to all users:", error);
  }
}

export async function deleteEventFromAllRelevantUsers(
  event: EventWithVenue
): Promise<void> {
  try {
    // Delete from all users who have a sync mapping for this event
    const mappings = await db.userGoogleCalendarEvent.findMany({
      where: { eventId: event.id },
      select: { userId: true },
    });
    await Promise.allSettled(
      mappings.map((m) => deleteEventFromGoogleCalendar(m.userId, event))
    );
  } catch (error) {
    console.error("Failed to delete event from all users:", error);
  }
}

export async function removeAllSyncedEvents(userId: string): Promise<void> {
  const mappings = await db.userGoogleCalendarEvent.findMany({
    where: { userId },
  });
  if (mappings.length === 0) return;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
  });

  if (user?.googleCalendarSyncEnabled) {
    const calendarId = user.googleCalendarId || "primary";
    const accessToken = await getValidAccessToken(userId);
    const tokens = await getDecryptedTokens(userId);

    if (tokens) {
      const client = createGoogleCalendarClient(
        accessToken,
        tokens.refreshToken
      );

      const BATCH_SIZE = 10;
      for (let i = 0; i < mappings.length; i += BATCH_SIZE) {
        const batch = mappings.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map((m) =>
            retryWithBackoff(() =>
              client.deleteEvent(calendarId, m.googleEventId)
            ).catch(() => {})
          )
        );
        if (i + BATCH_SIZE < mappings.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }
  }

  await db.userGoogleCalendarEvent.deleteMany({ where: { userId } });
}

async function getEventsVisibleToUser(): Promise<EventWithVenue[]> {
  return db.event.findMany({
    where: {
      status: "PUBLISHED",
      startsAt: { gt: new Date() },
    },
    include: { venue: true },
    orderBy: { startsAt: "asc" },
  });
}

async function getUsersWhoShouldSeeEvent(
  event: EventWithVenue
): Promise<Array<{ id: string }>> {
  if (event.status !== "PUBLISHED") return [];

  return db.user.findMany({
    where: { googleCalendarSyncEnabled: true },
    select: { id: true },
  });
}

/** Strip the trailing Z from an ISO string so Google treats it as the specified timeZone. */
function toLocalISOString(date: Date): string {
  return date.toISOString().replace("Z", "");
}

function convertToGoogleCalendarEvent(
  event: EventWithVenue
): calendar_v3.Schema$Event {
  const titleParts: string[] = [];
  if (event.titleEn) titleParts.push(event.titleEn);
  titleParts.push(event.titleJa);
  const summary = titleParts.join(" / ");

  const descParts: string[] = [];
  if (event.descriptionEn) descParts.push(event.descriptionEn);
  if (event.descriptionJa) descParts.push(event.descriptionJa);
  if (event.onlineUrl) descParts.push(`\nOnline: ${event.onlineUrl}`);
  const description = descParts.join("\n\n") || undefined;

  const location =
    event.venue?.nameEn ||
    event.venue?.nameJa ||
    (event.venue?.addressEn
      ? `${event.venue.nameJa}, ${event.venue.addressEn}`
      : undefined);

  const googleEvent: calendar_v3.Schema$Event = {
    summary,
    description,
    location,
    start: {
      dateTime: toLocalISOString(event.startsAt),
      timeZone: "Asia/Tokyo",
    },
    end: {
      dateTime: toLocalISOString(event.endsAt),
      timeZone: "Asia/Tokyo",
    },
    source: {
      title: "MSB Japan",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/events`,
    },
  };

  const colorMap: Record<EventMode, string> = {
    IN_PERSON: "9", // Blue
    ONLINE: "6", // Orange
    HYBRID: "2", // Sage
  };
  googleEvent.colorId = colorMap[event.mode] || "9";

  return googleEvent;
}
