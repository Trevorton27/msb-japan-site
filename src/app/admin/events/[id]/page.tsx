import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getEventById } from "@/server/queries/events";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { MemberRegistrationManager } from "@/components/admin/member-registration-manager";

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
    recurrenceRule: event.recurrenceRule ?? undefined,
    visibility: event.visibility,
  };

  const confirmedCount = event.registrations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;
  const waitlistedCount = event.registrations.filter(
    (r) => r.status === "WAITLISTED"
  ).length;
  const memberRegisteredCount = event.memberRegistrations.filter(
    (r) => r.status === "REGISTERED"
  ).length;
  const memberWaitlistedCount = event.memberRegistrations.filter(
    (r) => r.status === "WAITLISTED"
  ).length;

  // Get all users with any role for the registration manager
  const members = await db.user.findMany({
    where: {
      userRoles: { some: {} },
    },
    select: { id: true, name: true, email: true, isSanghaMember: true },
    orderBy: { name: "asc" },
  });

  const currentMemberRegistrations = event.memberRegistrations
    .filter((r) => r.status !== "CANCELLED")
    .map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name ?? r.user.email,
      userEmail: r.user.email,
      status: r.status,
    }));

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
        <div className="flex flex-wrap gap-6 text-sm">
          <span>
            Public Confirmed: <strong>{confirmedCount}</strong>
          </span>
          <span>
            Public Waitlisted: <strong>{waitlistedCount}</strong>
          </span>
          <span>
            Members Registered: <strong>{memberRegisteredCount}</strong>
          </span>
          <span>
            Members Waitlisted: <strong>{memberWaitlistedCount}</strong>
          </span>
          <span>
            Total:{" "}
            <strong>
              {event.registrations.length + memberRegisteredCount + memberWaitlistedCount}
            </strong>
          </span>
          {event.capacity && (
            <span>
              Capacity: <strong>{event.capacity}</strong>
            </span>
          )}
        </div>
      </div>

      <MemberRegistrationManager
        eventId={event.id}
        eventVisibility={event.visibility}
        members={members}
        registrations={currentMemberRegistrations}
      />

      <EventForm initialData={initialData} />
    </div>
  );
}
