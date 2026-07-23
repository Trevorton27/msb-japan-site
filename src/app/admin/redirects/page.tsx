import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllRedirects } from "@/server/actions/redirects";
import { RedirectActions } from "@/components/admin/redirect-actions";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminRedirectsPage() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const [redirects, locale] = await Promise.all([getAllRedirects(), getAdminLocale()]);
  const l = getLabels(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.redirects}</h1>
      </div>

      <RedirectActions />

      <div className="mt-6 rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{l.from}</th>
              <th className="px-4 py-3 font-medium">{l.to}</th>
              <th className="px-4 py-3 font-medium">{l.statusCode}</th>
              <th className="px-4 py-3 font-medium">{l.active}</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{r.fromPath}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.toPath}</td>
                <td className="px-4 py-3">{r.statusCode}</td>
                <td className="px-4 py-3">{r.active ? l.active : l.inactive}</td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {l.noRedirects}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
