import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { disconnectGoogleCalendar } from "@/server/google-calendar/tokenManager";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleCalendarSyncEnabled: true,
        googleCalendarId: true,
        googleCalendarLastSync: true,
        googleTokenExpiry: true,
      },
    });

    return NextResponse.json({
      success: true,
      connected: userData?.googleCalendarSyncEnabled || false,
      calendarId: userData?.googleCalendarId,
      lastSync: userData?.googleCalendarLastSync,
      tokenExpiry: userData?.googleTokenExpiry,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to check status" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await disconnectGoogleCalendar(session.user.id);
    return NextResponse.json({ success: true, message: "Disconnected" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
