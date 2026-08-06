import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Visitors with a heartbeat in the last 2 minutes are considered "current"
    const cutoff = new Date(Date.now() - 2 * 60 * 1000);

    const recent = await db.analyticsEvent.findMany({
      where: {
        event: "heartbeat",
        createdAt: { gte: cutoff },
      },
      orderBy: { createdAt: "desc" },
    });

    // Deduplicate by userAgent+path — keep the most recent per unique visitor
    const seen = new Map<string, { path: string; lastSeen: string; userAgent: string | null }>();
    for (const row of recent) {
      const key = `${row.userAgent ?? "unknown"}::${row.path ?? "/"}`;
      if (!seen.has(key)) {
        seen.set(key, {
          path: row.path ?? "/",
          lastSeen: row.createdAt.toISOString(),
          userAgent: row.userAgent,
        });
      }
    }

    const visitors = Array.from(seen.values());

    return NextResponse.json({ count: visitors.length, visitors });
  } catch {
    return NextResponse.json({ count: 0, visitors: [] });
  }
}
