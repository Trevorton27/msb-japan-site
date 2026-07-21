"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getAllOrdersAdmin(filters?: { status?: string }) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  return db.order.findMany({
    where: filters?.status
      ? {
          status: filters.status as
            | "PENDING"
            | "PAID"
            | "PROCESSING"
            | "SHIPPED"
            | "DELIVERED"
            | "CANCELLED"
            | "REFUNDED",
        }
      : undefined,
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  return db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
  });
}

export async function getOrderStats() {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  const [total, paid, processing, shipped, revenue] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "PAID" } }),
    db.order.count({ where: { status: "PROCESSING" } }),
    db.order.count({ where: { status: "SHIPPED" } }),
    db.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { totalAmount: true },
    }),
  ]);

  return { total, paid, processing, shipped, revenue: revenue._sum.totalAmount ?? 0 };
}
