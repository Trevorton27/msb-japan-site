import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getValidAccessToken,
  getDecryptedTokens,
} from "@/server/google-calendar/tokenManager";
import { createGoogleCalendarClient } from "@/server/google-calendar/googleCalendarClient";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get("maxResults") || "10");
    const timeMin = searchParams.get("timeMin") || new Date().toISOString();
    const timeMax = searchParams.get("timeMax") || undefined;

    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { googleCalendarSyncEnabled: true, googleCalendarId: true },
    });

    if (!dbUser || !dbUser.googleCalendarSyncEnabled) {
      return NextResponse.json({
        success: false,
        connected: false,
        events: [],
      });
    }

    const calendarId = dbUser.googleCalendarId || "primary";
    const accessToken = await getValidAccessToken(session.user.id);
    const tokens = await getDecryptedTokens(session.user.id);
    if (!tokens) {
      return NextResponse.json({
        success: false,
        connected: false,
        events: [],
      });
    }

    const client = createGoogleCalendarClient(accessToken, tokens.refreshToken);
    const response = await client.listEvents(calendarId, {
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response || []).map((event) => ({
      id: event.id,
      title: event.summary || "Untitled Event",
      description: event.description,
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      isAllDay: !!event.start?.date,
      location: event.location,
      htmlLink: event.htmlLink,
    }));

    return NextResponse.json({
      success: true,
      connected: true,
      events,
      count: events.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events", events: [] },
      { status: 500 }
    );
  }
}
