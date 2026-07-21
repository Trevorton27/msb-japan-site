"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getAnalyticsOverview(days: number = 30) {
  await requirePermission(PERMISSIONS.ANALYTICS_READ);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    totalPageViews,
    totalEvents,
    eventsByType,
    recentEvents,
    topPages,
  ] = await Promise.all([
    db.analyticsEvent.count({
      where: { event: "page_view", createdAt: { gte: since } },
    }),
    db.analyticsEvent.count({
      where: { createdAt: { gte: since } },
    }),
    db.analyticsEvent.groupBy({
      by: ["event"],
      where: { createdAt: { gte: since } },
      _count: { event: true },
      orderBy: { _count: { event: "desc" } },
    }),
    db.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.analyticsEvent.groupBy({
      by: ["path"],
      where: { event: "page_view", createdAt: { gte: since }, path: { not: null } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 20,
    }),
  ]);

  return {
    totalPageViews,
    totalEvents,
    eventsByType: eventsByType.map((e) => ({
      event: e.event,
      count: e._count.event,
    })),
    recentEvents,
    topPages: topPages.map((p) => ({
      path: p.path,
      count: p._count.path,
    })),
  };
}

export async function getAuditLogs(limit: number = 50) {
  await requirePermission(PERMISSIONS.ANALYTICS_READ);

  return db.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
