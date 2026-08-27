import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllUsersWithMemberStatus } from "@/server/actions/members";
import { Badge } from "@/components/ui/badge";
import { MemberAccessActions } from "@/components/admin/member-access-actions";
import { SanghaMemberToggle } from "@/components/admin/sangha-member-toggle";
import { getAdminLocale } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminMembersPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);
  const [users, locale] = await Promise.all([
    getAllUsersWithMemberStatus(),
    getAdminLocale(),
  ]);
  const l = getLabels(locale);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{l.members}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {locale === "en"
            ? "Grant or revoke member portal access for users."
            : "ユーザーに会員ポータルへのアクセス権を付与または取り消します。"}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">{l.name}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">{l.email}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">{l.role}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {locale === "en" ? "Member Access" : "会員アクセス"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {locale === "en" ? "Sangha Member" : "サンガ会員"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">{l.created}</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">{l.actions}</th>
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
                      user.isMember
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {user.isMember ? l.isMember : l.notMember}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <SanghaMemberToggle userId={user.id} isSanghaMember={user.isSanghaMember} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.createdAt.toLocaleDateString(dateFmt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <MemberAccessActions
                    userId={user.id}
                    isMember={user.isMember}
                    grantLabel={l.grantMember}
                    revokeLabel={l.revokeMember}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="py-8 text-center text-gray-500">{l.noData}</p>
        )}
      </div>
    </div>
  );
}
