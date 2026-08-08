import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllCentersAdmin } from "@/server/queries/centers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminCentersPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const [centers, locale] = await Promise.all([getAllCentersAdmin(), getAdminLocale()]);
  const l = getLabels(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {locale === "en" ? "Dharma Centers" : "ダルマセンター"}
        </h1>
        <Link href="/admin/centers/new">
          <Button>{locale === "en" ? "New Center" : "新規センター"}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{locale === "en" ? "Name" : "名称"}</th>
              <th className="px-4 py-3 font-medium">{locale === "en" ? "Location" : "場所"}</th>
              <th className="px-4 py-3 font-medium">{l.country}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {t(locale, center.nameJa, center.nameEn)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {t(locale, center.locationJa, center.locationEn) || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{center.country || "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={center.active ? "default" : "secondary"}>
                    {center.active ? l.active : l.inactive}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/centers/${center.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {l.edit}
                  </Link>
                </td>
              </tr>
            ))}
            {centers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {locale === "en" ? "No centers yet." : "センターはまだありません。"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
