"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/server/actions/orders";

const transitions: Record<string, { label: string; status: string }[]> = {
  PENDING: [{ label: "Cancel", status: "CANCELLED" }],
  PAID: [
    { label: "Start Processing", status: "PROCESSING" },
    { label: "Cancel & Refund", status: "CANCELLED" },
  ],
  PROCESSING: [
    { label: "Mark Shipped", status: "SHIPPED" },
    { label: "Cancel & Refund", status: "CANCELLED" },
  ],
  SHIPPED: [{ label: "Mark Delivered", status: "DELIVERED" }],
};

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusActions({
  orderId,
  currentStatus,
}: OrderStatusActionsProps) {
  const available = transitions[currentStatus] ?? [];

  if (available.length === 0) return null;

  return (
    <div className="flex gap-2">
      {available.map((t) => (
        <Button
          key={t.status}
          size="sm"
          variant={t.status === "CANCELLED" ? "destructive" : "default"}
          onClick={async () => {
            await updateOrderStatus(
              orderId,
              t.status as "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
            );
          }}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
