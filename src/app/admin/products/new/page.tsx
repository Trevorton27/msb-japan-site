import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Product</h1>
      <ProductForm />
    </div>
  );
}
