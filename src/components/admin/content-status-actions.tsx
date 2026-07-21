"use client";

import { Button } from "@/components/ui/button";
import { updatePostStatus } from "@/server/actions/content";

type Status = "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

const transitions: Record<Status, { label: string; next: Status }[]> = {
  DRAFT: [{ label: "Submit for Review", next: "REVIEW" }],
  REVIEW: [
    { label: "Approve", next: "APPROVED" },
    { label: "Return to Draft", next: "DRAFT" },
  ],
  APPROVED: [
    { label: "Publish Now", next: "PUBLISHED" },
    { label: "Schedule", next: "SCHEDULED" },
  ],
  SCHEDULED: [
    { label: "Publish Now", next: "PUBLISHED" },
    { label: "Unschedule", next: "APPROVED" },
  ],
  PUBLISHED: [{ label: "Archive", next: "ARCHIVED" }],
  ARCHIVED: [{ label: "Restore to Draft", next: "DRAFT" }],
};

export function ContentStatusActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const actions = transitions[currentStatus as Status] ?? [];
  if (actions.length === 0) return null;

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          variant={action.next === "PUBLISHED" ? "default" : "outline"}
          size="sm"
          onClick={() => updatePostStatus(id, action.next)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
