"use server";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { headers } from "next/headers";

export async function trackEvent(
  event: string,
  metadata?: Record<string, unknown>
) {
  const headersList = await headers();
  const path = headersList.get("x-pathname") ?? headersList.get("referer") ?? null;
  const referrer = headersList.get("referer") ?? null;
  const userAgent = headersList.get("user-agent") ?? null;

  await db.analyticsEvent.create({
    data: {
      event,
      path,
      referrer,
      userAgent,
      metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });
}

export async function trackPageView(path: string) {
  await trackEvent("page_view", { path });
}
