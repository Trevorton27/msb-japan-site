import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllMemberResourcesAdmin } from "@/server/queries/member-resources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminMemberResourcesPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const [resources, locale] = await Promise.all([
    getAllMemberResourcesAdmin(),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.memberResources}</h1>
        <Link href="/admin/member-resources/new">
          <Button>{l.newResource}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{l.title}</th>
              <th className="px-4 py-3 font-medium">{l.resourceType}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium">{l.featured}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {t(locale, r.titleJa, r.titleEn)}
                </td>
                <td className="px-4 py-3 text-gray-600">{r.resourceType}</td>
                <td className="px-4 py-3">
                  <Badge variant={r.published ? "default" : "secondary"}>
                    {r.published ? l.published : locale === "en" ? "Draft" : "下書き"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {r.featured && (
                    <span className="text-saffron-500">★</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/member-resources/${r.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {l.edit}
                  </Link>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {l.noMemberResources}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
