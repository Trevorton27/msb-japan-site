"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createProduct,
  updateProduct,
  type ProductFormValues,
  type VariantFormValues,
} from "@/server/actions/products";

interface ProductFormProps {
  initialData?: ProductFormValues & { id?: string; variants: (VariantFormValues & { id?: string })[] };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState<(VariantFormValues & { id?: string })[]>(
    initialData?.variants ?? [{ nameJa: "", priceAmount: 0, stockQuantity: 0 }]
  );

  const isEdit = !!initialData?.id;

  function addVariant() {
    setVariants([...variants, { nameJa: "", priceAmount: 0, stockQuantity: 0 }]);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: string, value: string | number | boolean) {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data: ProductFormValues = {
      slugJa: fd.get("slugJa") as string,
      slugEn: (fd.get("slugEn") as string) || undefined,
      nameJa: fd.get("nameJa") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      descriptionJa: (fd.get("descriptionJa") as string) || undefined,
      descriptionEn: (fd.get("descriptionEn") as string) || undefined,
      imageUrl: (fd.get("imageUrl") as string) || undefined,
      active: fd.get("active") === "on",
      sortOrder: Number(fd.get("sortOrder")) || 0,
      variants: variants.map((v) => ({
        id: v.id,
        nameJa: v.nameJa,
        nameEn: v.nameEn,
        sku: v.sku,
        priceAmount: v.priceAmount,
        stockQuantity: v.stockQuantity,
        active: v.active ?? true,
      })),
    };

    try {
      if (isEdit && initialData?.id) {
        await updateProduct(initialData.id, data);
      } else {
        await createProduct(data);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Product Info</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nameJa">Name (JA) *</Label>
            <Input id="nameJa" name="nameJa" required defaultValue={initialData?.nameJa} />
          </div>
          <div>
            <Label htmlFor="nameEn">Name (EN)</Label>
            <Input id="nameEn" name="nameEn" defaultValue={initialData?.nameEn} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slugJa">Slug (JA) *</Label>
            <Input id="slugJa" name="slugJa" required defaultValue={initialData?.slugJa} />
          </div>
          <div>
            <Label htmlFor="slugEn">Slug (EN)</Label>
            <Input id="slugEn" name="slugEn" defaultValue={initialData?.slugEn} />
          </div>
        </div>

        <div>
          <Label htmlFor="descriptionJa">Description (JA)</Label>
          <textarea
            id="descriptionJa"
            name="descriptionJa"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={initialData?.descriptionJa}
          />
        </div>
        <div>
          <Label htmlFor="descriptionEn">Description (EN)</Label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={initialData?.descriptionEn}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={initialData?.imageUrl} />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initialData?.sortOrder ?? 0} />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              id="active"
              name="active"
              type="checkbox"
              className="h-4 w-4"
              defaultChecked={initialData?.active ?? true}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Variants</legend>

        {variants.map((variant, index) => (
          <div key={index} className="rounded-md border bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Variant {index + 1}
              </span>
              {variants.length > 1 && (
                <button
                  type="button"
                  className="text-xs text-red-600 hover:text-red-800"
                  onClick={() => removeVariant(index)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Name (JA) *</Label>
                <Input
                  required
                  value={variant.nameJa}
                  onChange={(e) => updateVariant(index, "nameJa", e.target.value)}
                />
              </div>
              <div>
                <Label>Name (EN)</Label>
                <Input
                  value={variant.nameEn ?? ""}
                  onChange={(e) => updateVariant(index, "nameEn", e.target.value)}
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={variant.sku ?? ""}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                />
              </div>
              <div>
                <Label>Price (JPY) *</Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={variant.priceAmount}
                  onChange={(e) => updateVariant(index, "priceAmount", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  min={0}
                  required
                  value={variant.stockQuantity}
                  onChange={(e) => updateVariant(index, "stockQuantity", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          Add Variant
        </Button>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
