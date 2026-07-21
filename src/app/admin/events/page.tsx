import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllEventsAdmin } from "@/server/queries/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function AdminEventsPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  const events = await getAllEventsAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/admin/events/new">
          <Button>New Event</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Registrations</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{event.titleJa}</td>
                <td className="px-4 py-3 text-gray-600">
                  {event.startsAt.toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={statusColors[event.status] ?? ""}
                    variant="secondary"
                  >
                    {event.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{event.mode}</td>
                <td className="px-4 py-3 text-gray-600">
                  {event._count.registrations}
                  {event.capacity ? ` / ${event.capacity}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
