import { db } from "@/lib/db";
import { generateICS } from "@/lib/calendar";
import { NextResponse } from "next/server";

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
