import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getUserById } from "@/server/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { SanghaMemberToggle } from "@/components/admin/sangha-member-toggle";

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  const { id } = await params;
  const [user, locale] = await Promise.all([getUserById(id), getAdminLocale()]);

  if (!user) notFound();

  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="text-gray-400 hover:text-gray-600">
            &larr;
          </Link>
          <h1 className="text-2xl font-bold">{user.name ?? "Unnamed User"}</h1>
          {user.userRoles.map((ur) => (
            <Badge key={ur.id} variant="secondary">
              {ur.role.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-gray-500">Name:</span>{" "}
              <span className="font-medium">{user.name ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <span className="font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Login:</span>{" "}
              <Badge
                variant="secondary"
                className={
                  user.passwordHash
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }
              >
                {user.passwordHash ? "Password" : "Google only"}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>{" "}
              <span>{user.createdAt.toLocaleDateString(dateFmt)}</span>
            </div>
            {user.emailVerified && (
              <div>
                <span className="text-gray-500">Email verified:</span>{" "}
                <span>{user.emailVerified.toLocaleDateString(dateFmt)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Sangha Member:</span>{" "}
              <SanghaMemberToggle userId={user.id} isSanghaMember={user.isSanghaMember} />
            </div>
            <div>
              <span className="text-gray-500">Calendar sync:</span>{" "}
              <Badge
                variant="secondary"
                className={
                  user.googleCalendarSyncEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }
              >
                {user.googleCalendarSyncEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            {user.googleCalendarLastSync && (
              <div>
                <span className="text-gray-500">Last sync:</span>{" "}
                <span>{user.googleCalendarLastSync.toLocaleString(dateFmt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {user.memberEventRegistrations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 font-medium">Event</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {user.memberEventRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="py-2">
                        <Link
                          href={`/admin/events/${reg.event.id}/details`}
                          className="text-blue-600 hover:underline"
                        >
                          {t(locale, reg.event.titleJa, reg.event.titleEn)}
                        </Link>
                      </td>
                      <td className="py-2 text-gray-600">
                        {reg.event.startsAt.toLocaleDateString(dateFmt)}
                      </td>
                      <td className="py-2">
                        <Badge variant="secondary">{reg.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
