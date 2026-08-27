import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the next unpublished message by sortOrder
  const nextMessage = await db.dharmaMessage.findFirst({
    where: { published: true, publishedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  if (nextMessage) {
    // Publish this message
    await db.dharmaMessage.update({
      where: { id: nextMessage.id },
      data: { publishedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      action: "published",
      messageId: nextMessage.id,
    });
  }

  // All published messages have been shown — reset the cycle
  const publishedCount = await db.dharmaMessage.count({
    where: { published: true },
  });

  if (publishedCount === 0) {
    return NextResponse.json({ success: true, action: "no_messages" });
  }

  // Clear all publishedAt values to restart the rotation
  await db.dharmaMessage.updateMany({
    where: { published: true },
    data: { publishedAt: null },
  });

  // Pick the first one again
  const firstMessage = await db.dharmaMessage.findFirst({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  if (firstMessage) {
    await db.dharmaMessage.update({
      where: { id: firstMessage.id },
      data: { publishedAt: new Date() },
    });
  }

  return NextResponse.json({
    success: true,
    action: "cycle_reset",
    messageId: firstMessage?.id,
  });
}
