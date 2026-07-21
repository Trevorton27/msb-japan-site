"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getOrCreateCart() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;

  if (sessionId) {
    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (cart) return cart;
  }

  // Create new cart
  sessionId = crypto.randomUUID();
  const cart = await db.cart.create({
    data: { sessionId },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  cookieStore.set("cart_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return cart;
}

export async function getCart() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) return null;

  return db.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
        orderBy: { variant: { product: { nameJa: "asc" } } },
      },
    },
  });
}

export async function addToCart(variantId: string, quantity: number = 1) {
  const cart = await getOrCreateCart();

  // Verify variant exists and has stock
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant || !variant.active) {
    return { success: false, error: "Product not available" };
  }

  const existingItem = cart.items.find((item) => item.variantId === variantId);
  const newQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (newQuantity > variant.stockQuantity) {
    return { success: false, error: "Not enough stock" };
  }

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await db.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    const item = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });
    if (!item) return { success: false, error: "Item not found" };
    if (quantity > item.variant.stockQuantity) {
      return { success: false, error: "Not enough stock" };
    }
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  revalidatePath("/");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/");
  return { success: true };
}

export async function clearCart() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) return;

  await db.cartItem.deleteMany({
    where: { cart: { sessionId } },
  });
  revalidatePath("/");
}
