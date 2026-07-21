"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export interface ProductFormValues {
  slugJa: string;
  slugEn?: string;
  nameJa: string;
  nameEn?: string;
  descriptionJa?: string;
  descriptionEn?: string;
  imageUrl?: string;
  active?: boolean;
  sortOrder?: number;
  variants: VariantFormValues[];
}

export interface VariantFormValues {
  id?: string;
  nameJa: string;
  nameEn?: string;
  sku?: string;
  priceAmount: number;
  stockQuantity: number;
  active?: boolean;
}

export async function createProduct(data: ProductFormValues) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  await db.product.create({
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      nameJa: data.nameJa,
      nameEn: data.nameEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
      variants: {
        create: data.variants.map((v) => ({
          nameJa: v.nameJa,
          nameEn: v.nameEn || null,
          sku: v.sku || null,
          priceAmount: v.priceAmount,
          stockQuantity: v.stockQuantity,
          active: v.active ?? true,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, data: ProductFormValues) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  // Update product fields
  await db.product.update({
    where: { id },
    data: {
      slugJa: data.slugJa,
      slugEn: data.slugEn || null,
      nameJa: data.nameJa,
      nameEn: data.nameEn || null,
      descriptionJa: data.descriptionJa || null,
      descriptionEn: data.descriptionEn || null,
      imageUrl: data.imageUrl || null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  // Upsert variants
  const existingVariantIds = new Set(
    data.variants.filter((v) => v.id).map((v) => v.id!)
  );

  // Delete removed variants
  await db.productVariant.deleteMany({
    where: { productId: id, id: { notIn: [...existingVariantIds] } },
  });

  // Upsert each variant
  for (const v of data.variants) {
    if (v.id) {
      await db.productVariant.update({
        where: { id: v.id },
        data: {
          nameJa: v.nameJa,
          nameEn: v.nameEn || null,
          sku: v.sku || null,
          priceAmount: v.priceAmount,
          stockQuantity: v.stockQuantity,
          active: v.active ?? true,
        },
      });
    } else {
      await db.productVariant.create({
        data: {
          productId: id,
          nameJa: v.nameJa,
          nameEn: v.nameEn || null,
          sku: v.sku || null,
          priceAmount: v.priceAmount,
          stockQuantity: v.stockQuantity,
          active: v.active ?? true,
        },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  await db.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function adjustInventory(
  variantId: string,
  quantity: number,
  reason: string
) {
  await requirePermission(PERMISSIONS.COMMERCE_MANAGE);

  await db.$transaction([
    db.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: { increment: quantity } },
    }),
    db.inventoryAdjustment.create({
      data: { variantId, quantity, reason },
    }),
  ]);

  revalidatePath("/admin/products");
  return { success: true };
}
