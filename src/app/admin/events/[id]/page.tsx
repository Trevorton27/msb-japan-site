import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getEventById } from "@/server/queries/events";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { Badge } from "@/components/ui/badge";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  const initialData = {
    id: event.id,
    slugJa: event.slugJa,
    slugEn: event.slugEn ?? undefined,
    titleJa: event.titleJa,
    titleEn: event.titleEn ?? undefined,
    descriptionJa: event.descriptionJa ?? undefined,
    descriptionEn: event.descriptionEn ?? undefined,
    status: event.status,
    mode: event.mode,
    priceType: event.priceType,
    priceAmount: event.priceAmount ?? undefined,
    capacity: event.capacity ?? undefined,
    beginnerFriendly: event.beginnerFriendly,
    startsAt: event.startsAt.toISOString().slice(0, 16),
    endsAt: event.endsAt.toISOString().slice(0, 16),
    registrationOpensAt: event.registrationOpensAt
      ? event.registrationOpensAt.toISOString().slice(0, 16)
      : undefined,
    registrationClosesAt: event.registrationClosesAt
      ? event.registrationClosesAt.toISOString().slice(0, 16)
      : undefined,
    venueId: event.venueId ?? undefined,
    onlineUrl: event.onlineUrl ?? undefined,
    imageUrl: event.imageUrl ?? undefined,
    seriesId: event.seriesId ?? undefined,
  };

  const confirmedCount = event.registrations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;
  const waitlistedCount = event.registrations.filter(
    (r) => r.status === "WAITLISTED"
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <Badge variant="secondary">{event.status}</Badge>
      </div>

      <div className="mb-8 rounded-lg border bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-500">
          Registrations
        </h2>
        <div className="flex gap-6 text-sm">
          <span>
            Confirmed: <strong>{confirmedCount}</strong>
          </span>
          <span>
            Waitlisted: <strong>{waitlistedCount}</strong>
          </span>
          <span>
            Total: <strong>{event.registrations.length}</strong>
          </span>
          {event.capacity && (
            <span>
              Capacity: <strong>{event.capacity}</strong>
            </span>
          )}
        </div>
      </div>

      <EventForm initialData={initialData} />
    </div>
  );
}
