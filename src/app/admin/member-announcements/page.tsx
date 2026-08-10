import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllAnnouncementsAdmin } from "@/server/queries/member-announcements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminMemberAnnouncementsPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const [announcements, locale] = await Promise.all([
    getAllAnnouncementsAdmin(),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.memberAnnouncements}</h1>
        <Link href="/admin/member-announcements/new">
          <Button>{l.newAnnouncement}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{l.title}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium">{l.pinned}</th>
              <th className="px-4 py-3 font-medium">{l.date}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {t(locale, a.titleJa, a.titleEn)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={a.published ? "default" : "secondary"}>
                    {a.published ? l.published : locale === "en" ? "Draft" : "下書き"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {a.pinned && <span className="text-saffron-500">📌</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {(a.publishedAt ?? a.createdAt).toLocaleDateString(dateFmt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/member-announcements/${a.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {l.edit}
                  </Link>
                </td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {l.noMemberAnnouncements}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
