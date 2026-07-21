import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getSocialAccounts, getSocialPosts } from "@/server/queries/social";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialPostActions } from "@/components/admin/social-post-actions";
import { SocialAccountActions } from "@/components/admin/social-account-actions";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  published: "default",
  draft: "outline",
  scheduled: "secondary",
  failed: "destructive",
};

export default async function AdminSocialPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);
  const params = await searchParams;

  const [accounts, posts] = await Promise.all([
    getSocialAccounts(),
    getSocialPosts({
      status: params.status || undefined,
      accountId: params.account || undefined,
    }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Social Publishing</h1>
        <Link href="/admin/social/compose">
          <Button>Compose Post</Button>
        </Link>
      </div>

      {/* Status messages from OAuth */}
      {params.success === "connected" && (
        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Social account connected successfully.
        </div>
      )}
      {params.error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Connection failed: {params.error.replace(/_/g, " ")}
        </div>
      )}

      {/* Accounts section */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Connected Accounts</h2>
        <SocialAccountActions
          accounts={accounts.map((a) => ({
            id: a.id,
            platform: a.platform,
            accountName: a.accountName,
            tokenExpiresAt: a.tokenExpiresAt,
          }))}
        />
      </section>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {["", "draft", "scheduled", "published", "failed"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/social?status=${s}` : "/admin/social"}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              (params.status ?? "") === s
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </Link>
        ))}
      </div>

      {/* Posts table */}
      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Caption</th>
              <th className="px-4 py-3 text-left font-medium">Account</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Scheduled</th>
              <th className="px-4 py-3 text-left font-medium">Published</th>
              <th className="px-4 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No social posts yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="max-w-[300px] truncate px-4 py-3">
                    {post.caption ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.socialAccount.accountName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[post.status] ?? "secondary"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.scheduledAt
                      ? post.scheduledAt.toLocaleString("ja-JP")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {post.publishedAt
                      ? post.publishedAt.toLocaleString("ja-JP")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <SocialPostActions postId={post.id} status={post.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
