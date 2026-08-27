import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllDharmaMessagesAdmin } from "@/server/queries/dharma-messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";

export default async function AdminDharmaMessagesPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const [messages, locale] = await Promise.all([
    getAllDharmaMessagesAdmin(),
    getAdminLocale(),
  ]);
  const dateFmt = locale === "en" ? "en-US" : "ja-JP";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {locale === "en" ? "Dharma Messages" : "法話メッセージ"}
        </h1>
        <Link href="/admin/dharma-messages/new">
          <Button>{locale === "en" ? "New Message" : "新規メッセージ"}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">
                {locale === "en" ? "Quote" : "引用"}
              </th>
              <th className="px-4 py-3 font-medium">
                {locale === "en" ? "Attribution" : "出典者"}
              </th>
              <th className="px-4 py-3 font-medium">
                {locale === "en" ? "Status" : "ステータス"}
              </th>
              <th className="px-4 py-3 font-medium">
                {locale === "en" ? "Published At" : "公開日"}
              </th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-gray-500">{msg.sortOrder}</td>
                <td className="px-4 py-3 font-medium max-w-xs truncate">
                  {t(locale, msg.quoteJa, msg.quoteEn).slice(0, 60)}
                  {t(locale, msg.quoteJa, msg.quoteEn).length > 60 ? "..." : ""}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {t(locale, msg.attributionJa, msg.attributionEn)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={msg.published ? "default" : "secondary"}>
                    {msg.published
                      ? locale === "en" ? "Published" : "公開済み"
                      : locale === "en" ? "Draft" : "下書き"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {msg.publishedAt
                    ? msg.publishedAt.toLocaleDateString(dateFmt)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/dharma-messages/${msg.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {locale === "en" ? "Edit" : "編集"}
                  </Link>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {locale === "en"
                    ? "No dharma messages yet."
                    : "法話メッセージはまだありません。"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
