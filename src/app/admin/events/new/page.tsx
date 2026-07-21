import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { EventForm } from "@/components/admin/event-form";

export default async function NewEventPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Event</h1>
      <EventForm />
    </div>
  );
}
