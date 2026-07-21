"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/server/actions/cart";

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    nameJa: string;
    nameEn: string | null;
    priceAmount: number;
    stockQuantity: number;
    product: {
      nameJa: string;
      nameEn: string | null;
      imageUrl: string | null;
    };
  };
}

interface CartItemsProps {
  items: CartItem[];
  locale: string;
}

export function CartItems({ items, locale }: CartItemsProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleQuantityChange(itemId: string, quantity: number) {
    setUpdating(itemId);
    await updateCartItemQuantity(itemId, quantity);
    setUpdating(null);
  }

  async function handleRemove(itemId: string) {
    setUpdating(itemId);
    await removeFromCart(itemId);
    setUpdating(null);
  }

  return (
    <div className="divide-y">
      {items.map((item) => {
        const productName =
          locale === "en" && item.variant.product.nameEn
            ? item.variant.product.nameEn
            : item.variant.product.nameJa;
        const variantName =
          locale === "en" && item.variant.nameEn
            ? item.variant.nameEn
            : item.variant.nameJa;
        const isUpdating = updating === item.id;

        return (
          <div key={item.id} className="flex items-center gap-4 py-4">
            {item.variant.product.imageUrl && (
              <img
                src={item.variant.product.imageUrl}
                alt={productName}
                className="h-16 w-16 rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-charcoal-900">{productName}</p>
              <p className="text-sm text-charcoal-500">{variantName}</p>
              <p className="text-sm font-mono text-charcoal-700">
                ¥{item.variant.priceAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded border text-center text-sm disabled:opacity-50"
                disabled={isUpdating || item.quantity <= 1}
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                className="h-8 w-8 rounded border text-center text-sm disabled:opacity-50"
                disabled={isUpdating || item.quantity >= item.variant.stockQuantity}
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-mono text-sm font-medium">
              ¥{(item.variant.priceAmount * item.quantity).toLocaleString()}
            </p>
            <Button
              size="sm"
              variant="ghost"
              disabled={isUpdating}
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              {locale === "ja" ? "削除" : "Remove"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
