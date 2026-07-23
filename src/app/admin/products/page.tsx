import Link from "next/link";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAllProductsAdmin } from "@/server/queries/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminLocale, t } from "@/lib/admin-locale";
import { getLabels } from "@/lib/admin-labels";

export default async function AdminProductsPage() {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);
  const [products, locale] = await Promise.all([getAllProductsAdmin(), getAdminLocale()]);
  const l = getLabels(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{l.products}</h1>
        <Link href="/admin/products/new">
          <Button>{l.newProduct}</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="px-4 py-3 font-medium">{l.product}</th>
              <th className="px-4 py-3 font-medium">{l.variants}</th>
              <th className="px-4 py-3 font-medium">{l.priceRange}</th>
              <th className="px-4 py-3 font-medium">{l.totalStock}</th>
              <th className="px-4 py-3 font-medium">{l.status}</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const prices = product.variants.map((v) => v.priceAmount);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{t(locale, product.nameJa, product.nameEn)}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.variants.length}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">
                    {minPrice === maxPrice
                      ? `¥${minPrice.toLocaleString()}`
                      : `¥${minPrice.toLocaleString()} – ¥${maxPrice.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{totalStock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? l.active : l.inactive}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:underline">
                      {l.edit}
                    </Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">{l.noProducts}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
