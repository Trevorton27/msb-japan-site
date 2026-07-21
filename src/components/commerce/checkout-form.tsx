"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCommerceCheckoutSession } from "@/lib/stripe/commerce-checkout";

interface CheckoutFormProps {
  locale: string;
  totalAmount: number;
}

export function CheckoutForm({ locale, totalAmount }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    try {
      const result = await createCommerceCheckoutSession({
        email: fd.get("email") as string,
        locale,
        shippingName: (fd.get("shippingName") as string) || undefined,
        shippingAddress: (fd.get("shippingAddress") as string) || undefined,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : locale === "ja"
            ? "エラーが発生しました。"
            : "An error occurred."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">
          {locale === "ja" ? "メールアドレス" : "Email"} *
        </Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="shippingName">
          {locale === "ja" ? "お届け先氏名" : "Shipping Name"}
        </Label>
        <Input id="shippingName" name="shippingName" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="shippingAddress">
          {locale === "ja" ? "お届け先住所" : "Shipping Address"}
        </Label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          rows={3}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-burgundy-600 hover:bg-burgundy-700"
        size="lg"
      >
        {loading
          ? locale === "ja" ? "処理中..." : "Processing..."
          : `${locale === "ja" ? "購入する" : "Checkout"} ¥${totalAmount.toLocaleString()}`}
      </Button>
    </form>
  );
}
