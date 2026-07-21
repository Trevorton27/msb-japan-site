"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/server/actions/cart";

interface AddToCartButtonProps {
  variantId: string;
  inStock: boolean;
  label: string;
  outOfStockLabel: string;
}

export function AddToCartButton({
  variantId,
  inStock,
  label,
  outOfStockLabel,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await addToCart(variantId, 1);
    setLoading(false);
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  if (!inStock) {
    return (
      <Button disabled size="sm" variant="outline">
        {outOfStockLabel}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="bg-burgundy-600 hover:bg-burgundy-700"
    >
      {added ? "✓" : loading ? "..." : label}
    </Button>
  );
}
