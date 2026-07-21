import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getProductById } from "@/server/queries/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
      <ProductForm
        initialData={{
          id: product.id,
          slugJa: product.slugJa,
          slugEn: product.slugEn ?? undefined,
          nameJa: product.nameJa,
          nameEn: product.nameEn ?? undefined,
          descriptionJa: product.descriptionJa ?? undefined,
          descriptionEn: product.descriptionEn ?? undefined,
          imageUrl: product.imageUrl ?? undefined,
          active: product.active,
          sortOrder: product.sortOrder,
          variants: product.variants.map((v) => ({
            id: v.id,
            nameJa: v.nameJa,
            nameEn: v.nameEn ?? undefined,
            sku: v.sku ?? undefined,
            priceAmount: v.priceAmount,
            stockQuantity: v.stockQuantity,
            active: v.active,
          })),
        }}
      />
    </div>
  );
}
