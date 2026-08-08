import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { BookForm } from "@/components/admin/book-form";

export default async function NewBookPage() {
  await requirePermission(PERMISSIONS.CONTENT_PUBLISH);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Book</h1>
      <BookForm />
    </div>
  );
}
