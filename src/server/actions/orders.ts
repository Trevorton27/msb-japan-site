"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  await db.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function addOrderNote(id: string, notes: string) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  await db.order.update({
    where: { id },
    data: { notes },
  });

  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
