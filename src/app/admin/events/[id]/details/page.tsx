import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getEventDetailsById } from "@/server/queries/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAdminLocale, t } from "@/lib/admin-locale";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  const { id } = await params;
  const [event, locale] = await Promise.all([
    getEventDetailsById(id),
    getAdminLocale(),
  ]);

  if (!event) notFound();

  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  const confirmedCount = event.registrations.filter(
    (r) => r.status === "CONFIRMED"
  ).length;
  const waitlistedCount = event.registrations.filter(
    (r) => r.status === "WAITLISTED"
  ).length;
  const memberRegistered = event.memberRegistrations.filter(
    (r) => r.status === "REGISTERED"
  );
  const memberWaitlisted = event.memberRegistrations.filter(
    (r) => r.status === "WAITLISTED"
  );
  const activeMemberRegs = [...memberRegistered, ...memberWaitlisted];

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="text-gray-400 hover:text-gray-600"
          >
            &larr;
          </Link>
          <h1 className="text-2xl font-bold">
            {t(locale, event.titleJa, event.titleEn)}
          </h1>
          <Badge
            className={statusColors[event.status] ?? ""}
            variant="secondary"
          >
            {event.status}
          </Badge>
        </div>
        <Link href={`/admin/events/${event.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-gray-500">Title (JA):</span>{" "}
              <span className="font-medium">{event.titleJa}</span>
            </div>
            {event.titleEn && (
              <div>
                <span className="text-gray-500">Title (EN):</span>{" "}
                <span className="font-medium">{event.titleEn}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Start:</span>{" "}
              <span>{event.startsAt.toLocaleString(dateFmt)}</span>
            </div>
            <div>
              <span className="text-gray-500">End:</span>{" "}
              <span>{event.endsAt.toLocaleString(dateFmt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Mode:</span>{" "}
              <span>{event.mode}</span>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>{" "}
              <span>
                {event.priceType === "FREE"
                  ? "Free"
                  : `${event.priceType} — ¥${event.priceAmount?.toLocaleString() ?? "—"}`}
              </span>
            </div>
            {event.capacity && (
              <div>
                <span className="text-gray-500">Capacity:</span>{" "}
                <span>{event.capacity}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Beginner friendly:</span>{" "}
              <span>{event.beginnerFriendly ? "Yes" : "No"}</span>
            </div>
            {event.venue && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Venue:</span>{" "}
                <span>
                  {t(locale, event.venue.nameJa, event.venue.nameEn)}
                </span>
              </div>
            )}
            {event.onlineUrl && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Online URL:</span>{" "}
                <a
                  href={event.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {event.onlineUrl}
                </a>
              </div>
            )}
            {event.series && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Series:</span>{" "}
                <span>
                  {t(locale, event.series.titleJa, event.series.titleEn)}
                </span>
              </div>
            )}
            {event.recurrenceRule && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Recurrence:</span>{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  {event.recurrenceRule}
                </code>
              </div>
            )}
            {event.descriptionJa && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Description (JA):</span>
                <p className="mt-1 whitespace-pre-wrap text-gray-700">
                  {event.descriptionJa}
                </p>
              </div>
            )}
            {event.descriptionEn && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Description (EN):</span>
                <p className="mt-1 whitespace-pre-wrap text-gray-700">
                  {event.descriptionEn}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-6">
              <span>
                Public Confirmed: <strong>{confirmedCount}</strong>
              </span>
              <span>
                Public Waitlisted: <strong>{waitlistedCount}</strong>
              </span>
              <span>
                Members Registered: <strong>{memberRegistered.length}</strong>
              </span>
              <span>
                Members Waitlisted: <strong>{memberWaitlisted.length}</strong>
              </span>
              {event.capacity && (
                <span>
                  Capacity: <strong>{event.capacity}</strong>
                </span>
              )}
            </div>

            {activeMemberRegs.length > 0 && (
              <>
                <h3 className="pt-2 font-semibold text-gray-500">
                  Registered Members
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeMemberRegs.map((reg) => (
                      <tr key={reg.id}>
                        <td className="py-2">
                          <Link
                            href={`/admin/users/${reg.user.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {reg.user.name ?? "Unnamed"}
                          </Link>
                        </td>
                        <td className="py-2 text-gray-600">
                          {reg.user.email}
                        </td>
                        <td className="py-2">
                          <Badge variant="secondary">{reg.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
