"use server";

import { getStripe } from "./index";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

export async function createCommerceCheckoutSession({
  email,
  locale,
  shippingName,
  shippingAddress,
}: {
  email: string;
  locale: string;
  shippingName?: string;
  shippingAddress?: string;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) throw new Error("No cart found");

  const cart = await db.cart.findUnique({
    where: { sessionId },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Validate stock and build line items
  const lineItems: CheckoutItem[] = [];
  for (const item of cart.items) {
    if (!item.variant.active || !item.variant.product.active) {
      throw new Error(`Product no longer available: ${item.variant.nameJa}`);
    }
    if (item.quantity > item.variant.stockQuantity) {
      throw new Error(`Not enough stock for: ${item.variant.nameJa}`);
    }
    lineItems.push({ variantId: item.variantId, quantity: item.quantity });
  }

  // Create Stripe session
  const stripeSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: cart.items.map((item) => {
      const name =
        locale === "en" && item.variant.product.nameEn
          ? item.variant.product.nameEn
          : item.variant.product.nameJa;
      const variantName =
        locale === "en" && item.variant.nameEn
          ? item.variant.nameEn
          : item.variant.nameJa;

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: `${name} — ${variantName}`,
          },
          unit_amount: item.variant.priceAmount,
        },
        quantity: item.quantity,
      };
    }),
    metadata: {
      type: "order",
      cartSessionId: sessionId,
    },
    success_url: `${APP_URL}/${locale}/shop/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/${locale}/shop/cart`,
  });

  // Create order record
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.variant.priceAmount * item.quantity,
    0
  );

  await db.order.create({
    data: {
      email,
      totalAmount,
      stripeSessionId: stripeSession.id,
      shippingName: shippingName || null,
      shippingAddress: shippingAddress || null,
      status: "PENDING",
      items: {
        create: lineItems.map((li) => {
          const cartItem = cart.items.find((i) => i.variantId === li.variantId)!;
          return {
            variantId: li.variantId,
            quantity: li.quantity,
            unitPrice: cartItem.variant.priceAmount,
          };
        }),
      },
    },
  });

  return { url: stripeSession.url, sessionId: stripeSession.id };
}
