import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getCart } from "@/server/actions/cart";
import { CartItems } from "@/components/commerce/cart-items";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: locale === "ja" ? "カート — MSB Japan" : "Cart — MSB Japan",
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const cart = await getCart();
  const items = cart?.items ?? [];
  const totalAmount = items.reduce(
    (sum, item) => sum + item.variant.priceAmount * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {locale === "ja" ? "カート" : "Cart"}
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-charcoal-500">
            {locale === "ja"
              ? "カートは空です。"
              : "Your cart is empty."}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="mt-4 inline-block text-burgundy-600 hover:text-burgundy-700"
          >
            {locale === "ja" ? "ショップに戻る" : "Continue Shopping"}
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <CartItems items={items} locale={locale} />

          <Separator className="my-6" />

          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-semibold text-charcoal-900">
              {locale === "ja" ? "合計" : "Total"}
            </span>
            <span className="text-xl font-bold font-mono text-charcoal-900">
              ¥{totalAmount.toLocaleString()}
            </span>
          </div>

          <CheckoutForm locale={locale} totalAmount={totalAmount} />

          <div className="mt-4 text-center">
            <Link
              href={`/${locale}/shop`}
              className="text-sm text-charcoal-500 hover:text-charcoal-700"
            >
              {locale === "ja" ? "買い物を続ける" : "Continue Shopping"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
