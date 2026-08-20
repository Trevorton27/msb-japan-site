import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { batchSyncEvents } from "@/server/google-calendar/syncService";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await batchSyncEvents(session.user.id);
    return NextResponse.json({
      success: true,
      message: "Batch sync completed",
      result,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: "Batch sync failed",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
