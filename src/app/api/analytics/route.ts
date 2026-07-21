import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, path, metadata } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? null;
    const referrer = request.headers.get("referer") ?? null;

    await db.analyticsEvent.create({
      data: {
        event,
        path: path ?? null,
        referrer,
        userAgent,
        metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
