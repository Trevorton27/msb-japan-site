"use client";

import { Button } from "@/components/ui/button";
import { updateContactStatus } from "@/server/actions/contacts";

type Status = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

const transitions: Record<Status, { label: string; next: Status }[]> = {
  NEW: [
    { label: "Mark Read", next: "READ" },
    { label: "Archive", next: "ARCHIVED" },
  ],
  READ: [
    { label: "Mark Replied", next: "REPLIED" },
    { label: "Archive", next: "ARCHIVED" },
  ],
  REPLIED: [{ label: "Archive", next: "ARCHIVED" }],
  ARCHIVED: [{ label: "Reopen", next: "NEW" }],
};

export function ContactStatusActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const actions = transitions[currentStatus as Status] ?? [];

  if (actions.length === 0) return null;

  return (
    <div className="mt-3 flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          variant="outline"
          size="sm"
          onClick={() => updateContactStatus(id, action.next)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
