"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";

export async function getAllDonationsAdmin(filters?: {
  status?: string;
  recurring?: boolean;
}) {
  await requirePermission(PERMISSIONS.DONATIONS_READ);

  return db.donation.findMany({
    where: {
      ...(filters?.status
        ? {
            status: filters.status as
              | "PENDING"
              | "COMPLETED"
              | "FAILED"
              | "REFUNDED",
          }
        : undefined),
      ...(filters?.recurring !== undefined
        ? { recurring: filters.recurring }
        : undefined),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDonationStats() {
  await requirePermission(PERMISSIONS.DONATIONS_READ);

  const [total, completed, recurring, totalAmount] = await Promise.all([
    db.donation.count(),
    db.donation.count({ where: { status: "COMPLETED" } }),
    db.donation.count({ where: { recurring: true, status: "COMPLETED" } }),
    db.donation.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  return {
    total,
    completed,
    recurring,
    totalAmount: totalAmount._sum.amount ?? 0,
  };
}
