import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllBooksAdmin } from "@/server/queries/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminBooksPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const [books, locale] = await Promise.all([getAllBooksAdmin(), getAdminLocale()]);
  const l = getLabels(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{locale === "en" ? "Books" : "書籍"}</h1>
        <Link href="/admin/books/new">
          <Button>{locale === "en" ? "New Book" : "新規書籍"}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{locale === "en" ? "Title" : "タイトル"}</th>
              <th className="px-4 py-3 font-medium">{l.author}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {t(locale, book.titleJa, book.titleEn)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {t(locale, book.authorJa, book.authorEn) || "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={book.active ? "default" : "secondary"}>
                    {book.active ? l.active : l.inactive}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/books/${book.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {l.edit}
                  </Link>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {locale === "en" ? "No books yet." : "書籍はまだありません。"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
