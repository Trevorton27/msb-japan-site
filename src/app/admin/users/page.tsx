import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getUsers, getRoles } from "@/server/actions/users";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "@/components/admin/user-actions";
import { AddUserForm } from "@/components/admin/add-user-form";

export default async function AdminUsersPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <AddUserForm roles={roles} />
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Login</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium">{user.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  {user.userRoles.map((ur) => (
                    <Badge key={ur.id} variant="secondary" className="mr-1">
                      {ur.role.name}
                    </Badge>
                  ))}
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.createdAt.toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3 text-right">
                  <UserActions user={user} roles={roles} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-8 text-center text-gray-500">No users yet.</p>
        )}
      </div>
    </div>
  );
}
