import { db } from "@/lib/db";
import { generateICS } from "@/lib/calendar";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: { venue: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // PRIVATE events require auth + isSanghaMember
  if (event.visibility === "PRIVATE") {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { isSanghaMember: true },
    });
    if (!user?.isSanghaMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const ics = generateICS({
    title: event.titleJa,
    description: event.descriptionJa ?? undefined,
    location: event.venue?.nameJa ?? undefined,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slugJa}.ics"`,
    },
  });
}
