import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getBookById } from "@/server/queries/books";
import { BookForm } from "@/components/admin/book-form";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Book</h1>
      <BookForm
        initialData={{
          id: book.id,
          slugJa: book.slugJa,
          slugEn: book.slugEn ?? undefined,
          titleJa: book.titleJa,
          titleEn: book.titleEn ?? undefined,
          authorJa: book.authorJa ?? undefined,
          authorEn: book.authorEn ?? undefined,
          descriptionJa: book.descriptionJa ?? undefined,
          descriptionEn: book.descriptionEn ?? undefined,
          imageUrl: book.imageUrl ?? undefined,
          purchaseUrl: book.purchaseUrl ?? undefined,
          active: book.active,
          sortOrder: book.sortOrder,
        }}
      />
    </div>
  );
}
