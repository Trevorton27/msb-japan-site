import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllRedirects } from "@/server/actions/redirects";
import { RedirectActions } from "@/components/admin/redirect-actions";

export default async function AdminRedirectsPage() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const redirects = await getAllRedirects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Redirects</h1>
      </div>

      <RedirectActions />

      <div className="mt-6 rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{r.fromPath}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.toPath}</td>
                <td className="px-4 py-3">{r.statusCode}</td>
                <td className="px-4 py-3">{r.active ? "Yes" : "No"}</td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No redirects configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
