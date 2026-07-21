import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getSocialAccounts } from "@/server/queries/social";
import { SocialComposer } from "@/components/admin/social-composer";
import { db } from "@/lib/db";

export default async function ComposeSocialPostPage() {
  await requirePermission(PERMISSIONS.SOCIAL_PUBLISH);

  const [accounts, contentPosts] = await Promise.all([
    getSocialAccounts(),
    db.contentPost.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        titleJa: true,
        titleEn: true,
        excerptJa: true,
        imageUrl: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Compose Social Post</h1>
      <SocialComposer
        accounts={accounts.map((a) => ({
          id: a.id,
          platform: a.platform,
          accountName: a.accountName,
        }))}
        contentPosts={contentPosts}
      />
    </div>
  );
}
